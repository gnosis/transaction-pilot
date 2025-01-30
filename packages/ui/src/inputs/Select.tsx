import classNames from 'classnames'
import { ChevronDown, X } from 'lucide-react'
import { createContext, useContext, type ReactNode } from 'react'
import BaseSelect, {
  type ClassNamesConfig,
  type CommonProps,
  type GroupBase,
  type OptionProps,
  type Props,
} from 'react-select'
import Creatable, { type CreatableProps } from 'react-select/creatable'
import { GhostButton } from '../buttons'
import { Input, useClearLabel, useDropdownLabel } from './Input'
import { InputLayout, type InputLayoutProps } from './InputLayout'

const SelectContext = createContext({ inline: false })

const useInline = () => {
  const { inline } = useContext(SelectContext)

  return inline
}

type SelectStylesOptions = {
  inline?: boolean
}

export const selectStyles = <
  Option = unknown,
  Multi extends boolean = boolean,
>({ inline }: SelectStylesOptions = {}): ClassNamesConfig<
  Option,
  Multi,
  GroupBase<Option>
> => ({
  control: () =>
    classNames(
      'flex items-center cursor-pointer !min-h-auto',
      inline ? 'text-xs rounded hover:bg-zinc-100/10' : 'text-sm',
    ),
  valueContainer: () => 'p-0',
  dropdownIndicator: () =>
    'rounded-md shrink-0 hover:bg-zinc-200 text-zinc-500 dark:text-zinc-50 dark:hover:bg-zinc-700 self-center size-6 flex items-center justify-center',
  clearIndicator: () =>
    'rounded-md shrink-0 hover:bg-zinc-200 text-zinc-500 dark:text-zinc-50 dark:hover:bg-zinc-700 self-center size-6 flex items-center justify-center',
  menu: () =>
    'bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-xs border border-zinc-300/50 dark:border-zinc-600/50 rounded-md mt-1 shadow-lg text-sm',
  placeholder: () =>
    classNames(
      'text-zinc-500 dark:text-zinc-400',
      inline ? 'py-1 px-2' : 'px-4 py-2',
    ),
  option: ({ isSelected }) =>
    classNames(
      'text-sm px-4 py-2',
      isSelected != null &&
        'hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 cursor-pointer',
    ),
  indicatorsContainer: () =>
    classNames('shrink-0 flex gap-1', !inline && 'mr-2'),
  indicatorSeparator: () => 'hidden',
  noOptionsMessage: () => 'p-4 italic opacity-75',
})

type SelectBaseProps<Option, Creatable extends boolean> = {
  label: string
  clearLabel?: string
  dropdownLabel?: string
  allowCreate?: Creatable
  inline?: boolean
  children?: OptionRenderProps<Option>
}

export type SelectProps<
  Option,
  Creatable extends boolean,
  Multi extends boolean,
> = Creatable extends true
  ? CreatableProps<Option, Multi, GroupBase<Option>> &
      SelectBaseProps<Option, Creatable>
  : Props<Option, Multi> & SelectBaseProps<Option, Creatable>

export function Select<
  Option = unknown,
  Creatable extends boolean = false,
  Multi extends boolean = boolean,
>({
  label,
  clearLabel,
  dropdownLabel,
  allowCreate,
  isDisabled,
  inline = false,
  children,
  ...props
}: SelectProps<Option, Creatable, Multi>) {
  const Component = allowCreate ? Creatable : BaseSelect
  const Layout = inline ? InlineLayout : InputLayout

  return (
    <SelectContext value={{ inline }}>
      <Input
        hideLabel={inline}
        label={label}
        clearLabel={clearLabel}
        dropdownLabel={dropdownLabel}
      >
        {({ inputId }) => (
          <Layout disabled={isDisabled}>
            <Component
              {...props}
              unstyled
              isDisabled={isDisabled}
              inputId={inputId}
              components={{
                ClearIndicator: ClearIndicator<Option, Multi>,
                DropdownIndicator,
                ...(children == null
                  ? {}
                  : {
                      Option: createOptionRenderer<Option>(children),
                      SingleValue: createOptionRenderer<Option>(children, {
                        isValue: true,
                      }),
                    }),
              }}
              classNames={selectStyles<Option, Multi>({ inline })}
            />
          </Layout>
        )}
      </Input>
    </SelectContext>
  )
}

function ClearIndicator<Option, IsMulti extends boolean>({
  clearValue,
}: CommonProps<Option, IsMulti, GroupBase<Option>>) {
  return (
    <GhostButton iconOnly icon={X} size="small" onClick={clearValue}>
      {useClearLabel()}
    </GhostButton>
  )
}

Select.ClearIndicator = ClearIndicator

const DropdownIndicator = () => (
  <GhostButton
    iconOnly
    icon={ChevronDown}
    size={useInline() ? 'tiny' : 'small'}
  >
    {useDropdownLabel()}
  </GhostButton>
)

Select.DropdownIndicator = DropdownIndicator

const InlineLayout = ({ children }: InputLayoutProps) => children

type OptionRenderProps<Option> = (props: OptionProps<Option>) => ReactNode
type CreateOptionRendererOptions = {
  isValue?: boolean
}

function createOptionRenderer<Option>(
  children: OptionRenderProps<Option>,
  { isValue = false }: CreateOptionRendererOptions = {},
) {
  return (props: OptionProps<Option>) => (
    <div
      {...props.innerProps}
      className={props.getClassNames('option', props)}
      style={isValue ? { gridArea: '1 / 1 / 2 / 3 ' } : {}}
    >
      {children(props)}
    </div>
  )
}
