import { useCallback, useEffect, useState } from 'react'

/**
 * Retrieve multiple storage entries for the given keys at once.
 */
export function useStorageEntries<T>(collection: string) {
  const [entries, setEntries] = useState<{ [key: string]: T }>()

  // keep state in sync with storage
  useEffect(() => {
    chrome.storage.sync.get((allEntries) => {
      const matchingEntries = Object.entries(allEntries)
        .map(([itemKey, value]) => {
          const match = itemKey.match(new RegExp(`${collection}\\[(\\w+)\\]`))

          if (!match) return null
          return [match[1], value]
        })
        .filter(Boolean) as [string, T][]

      setEntries(Object.fromEntries(matchingEntries))
    })

    chrome.storage.sync.onChanged.addListener((changes) => {
      const matchingChanges = Object.entries(changes)
        .map(([itemKey, value]) => {
          const match = itemKey.match(new RegExp(`${collection}\\[(\\w+)\\]`))
          if (!match) return null
          return [match[1], value]
        })
        .filter(Boolean) as [string, chrome.storage.StorageChange][]

      if (matchingChanges.length > 0) {
        setEntries((current) => {
          let next = current
          for (const [key, change] of matchingChanges) {
            next = { ...next, [key]: change.newValue }
            // undefined values are removed
            if (change.newValue === undefined) {
              delete next[key]
            }
          }
          return next
        })
      }
    })
  }, [collection])

  const set = useCallback(
    async (key: string, value: T) => {
      await chrome.storage.sync.set({ [`${collection}[${key}]`]: value })
    },
    [collection],
  )

  return [entries, set] as const
}

/**
 * Read and write array items in extension sync storage. Each item is stored as a separate entry using the key `${key}[${index}]`.
 */
// export function useArrayStorage<T>(key: string) {
//   const [value, setValue] = useState<T[]>()

//   // keep state in sync with storage
//   useEffect(() => {
//     chrome.storage.sync.get((items) =>
//       setValue(
//         (
//           Object.entries(items)
//             .map(([itemKey, value]) => {
//               const match = itemKey.match(/\w+\[(\d+)\]/)
//               if (!match) return null
//               return [parseInt(match[1]), value]
//             })
//             .filter(Boolean) as [number, T][]
//         )
//           .sort(([a], [b]) => a - b)
//           .map(([, value]) => value)
//       )
//     )

//     chrome.storage.sync.onChanged.addListener((changes) => {
//       if (key in changes) {
//         changes[key].newValue && setValue(changes[key].newValue)
//         if (changes[key].newValue) setValue(changes[key].newValue)
//       }
//     })
//   }, [key, initialValue])

//   // referentially stable save callback
//   const saveRef = useRef<(value: T) => Promise<void>>()
//   saveRef.current = async (value: T) => {
//     await chrome.storage.sync.set({ [key]: value })
//   }
//   const save = useCallback(async (value: T) => {
//     saveRef.current?.(value)
//   }, [])

//   return [value, save] as const
// }
