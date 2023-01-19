import React from 'react'

import { useSettingsHash } from '../../routing'
import { useConnection } from '../../settings'
import BlockLink from '../BlockLink'
import Blockie from '../Blockie'
import Box from '../Box'
import ConnectionStack from '../ConnectionStack'
import Flex from '../Flex'

import classes from './style.module.css'

interface ConnectionsIconProps {
  width: string
  height: string
}

const ConnectionsIcon: React.FC<ConnectionsIconProps> = ({
  width = '42',
  height = '42',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M5.20242 18.609C4.87107 18.3576 4.58351 18.0514 4.35243 17.7036L4.35278 17.7048C3.8247 16.9312 3.58452 15.997 3.67607 15.0724C3.72742 14.5645 3.87308 14.0867 4.11339 13.6402L5.41542 11.2346L6.37153 11.777L5.87312 12.75L5.07971 14.1883C4.91003 14.5019 4.80451 14.8478 4.76913 15.206L4.76793 15.2063C4.72769 15.57 4.76128 15.9397 4.86666 16.293C4.97204 16.6461 5.147 16.9754 5.38081 17.2605C5.61163 17.5437 5.88324 17.7718 6.19216 17.9419C6.49845 18.1207 6.82962 18.2345 7.18605 18.2843C7.54591 18.3359 7.91073 18.3128 8.2584 18.2163C8.60599 18.1198 8.929 17.9521 9.20766 17.7233C9.4838 17.5015 9.74119 17.1719 9.90896 16.8575L11.1822 14.5052L12.138 15.0483L10.8465 17.4589C10.6101 17.9014 10.2883 18.2899 9.89964 18.602C9.18577 19.1738 8.2874 19.4623 7.36825 19.415C6.95827 19.3988 6.55254 19.3115 6.16874 19.157L-3.46243 36.8176L-4.41943 36.2748L5.20242 18.609ZM11.1822 14.5052L10.2219 13.9613L10.2255 13.9544L7.3362 12.3168L7.33323 12.3226L6.37153 11.777L5.41542 11.2346L6.70655 8.82277C6.94806 8.376 7.2658 7.9948 7.66217 7.6785C8.05376 7.36355 8.49241 7.13823 8.97776 7.00133C9.37464 6.88938 9.77987 6.84104 10.1911 6.85699C10.5992 6.88038 10.9971 6.97 11.3855 7.1243L20.7104 -9.79262L21.6659 -9.25075L12.3507 7.67267C12.6859 7.92775 12.9715 8.22581 13.2081 8.56808C13.4401 8.9169 13.6159 9.29476 13.7348 9.69924C13.8793 10.1879 13.9269 10.6987 13.8749 11.202C13.8275 11.7086 13.6795 12.1982 13.4397 12.6414L12.1389 15.0467L11.1822 14.5052ZM9.28991 8.06768C8.94748 8.16287 8.62857 8.32635 8.35165 8.54871C8.07389 8.77438 7.84336 9.05358 7.67287 9.37081L6.89416 10.8174L11.6947 13.54L12.4734 12.0934C12.6454 11.7785 12.7529 11.4307 12.7897 11.0703C12.8265 10.71 12.7918 10.3442 12.6876 9.99463C12.5846 9.63685 12.4114 9.3024 12.1785 9.01153C11.9535 8.73321 11.6804 8.49845 11.373 8.31918C11.0615 8.14696 10.7224 8.03416 10.3729 7.98648C10.0109 7.93952 9.64974 7.96618 9.28991 8.06768Z"
        fill="white"
      />
      <path
        d="M15.9556 24.609C15.6243 24.3576 15.3367 24.0514 15.1056 23.7036L15.106 23.7048C14.5779 22.9312 14.3377 21.997 14.4293 21.0724C14.4806 20.5645 14.6263 20.0867 14.8666 19.6402L16.1686 17.2346L17.1247 17.777L16.6263 18.75L15.8329 20.1883C15.6632 20.5019 15.5577 20.8478 15.5223 21.206L15.5211 21.2063C15.4809 21.57 15.5145 21.9397 15.6199 22.293C15.7252 22.6461 15.9002 22.9754 16.134 23.2605C16.3648 23.5437 16.6364 23.7718 16.9454 23.9419C17.2517 24.1207 17.5828 24.2345 17.9393 24.2843C18.2991 24.3359 18.6639 24.3128 19.0116 24.2163C19.3592 24.1198 19.6822 23.9521 19.9609 23.7233C20.237 23.5015 20.4944 23.1719 20.6622 22.8575L21.9354 20.5052L22.8913 21.0483L21.5997 23.4589C21.3633 23.9014 21.0415 24.2899 20.6528 24.602C19.939 25.1738 19.0406 25.4623 18.1215 25.415C17.7115 25.3988 17.3057 25.3115 16.9219 25.157L7.29077 42.8176L6.33378 42.2748L15.9556 24.609ZM21.9354 20.5052L20.9751 19.9613L20.9787 19.9544L18.0894 18.3168L18.0864 18.3226L17.1247 17.777L16.1686 17.2346L17.4598 14.8228C17.7013 14.376 18.019 13.9948 18.4154 13.6785C18.807 13.3636 19.2456 13.1382 19.731 13.0013C20.1279 12.8894 20.5331 12.841 20.9443 12.857C21.3525 12.8804 21.7503 12.97 22.1388 13.1243L31.4636 -3.79262L32.4191 -3.25075L23.1039 13.6727C23.4391 13.9277 23.7247 14.2258 23.9613 14.5681C24.1933 14.9169 24.3691 15.2948 24.488 15.6992C24.6325 16.1879 24.6801 16.6987 24.6281 17.202C24.5807 17.7086 24.4327 18.1982 24.1929 18.6414L22.8921 21.0467L21.9354 20.5052ZM20.0431 14.0677C19.7007 14.1629 19.3818 14.3264 19.1049 14.5487C18.8271 14.7744 18.5966 15.0536 18.4261 15.3708L17.6474 16.8174L22.4479 19.54L23.2266 18.0934C23.3986 17.7785 23.5061 17.4307 23.5429 17.0703C23.5797 16.71 23.545 16.3442 23.4408 15.9946C23.3378 15.6368 23.1646 15.3024 22.9317 15.0115C22.7067 14.7332 22.4336 14.4984 22.1262 14.3192C21.8147 14.147 21.4756 14.0342 21.1261 13.9865C20.7641 13.9395 20.4029 13.9662 20.0431 14.0677Z"
        fill="white"
      />
      <path
        d="M26.9556 30.609C26.6243 30.3576 26.3367 30.0514 26.1056 29.7036L26.106 29.7048C25.5779 28.9312 25.3377 27.997 25.4293 27.0724C25.4806 26.5645 25.6263 26.0867 25.8666 25.6402L27.1686 23.2346L28.1247 23.777L27.6263 24.75L26.8329 26.1883C26.6632 26.5019 26.5577 26.8478 26.5223 27.206L26.5211 27.2063C26.4809 27.57 26.5145 27.9397 26.6199 28.293C26.7252 28.6461 26.9002 28.9754 27.134 29.2605C27.3648 29.5437 27.6364 29.7718 27.9454 29.9419C28.2517 30.1207 28.5828 30.2345 28.9393 30.2843C29.2991 30.3359 29.6639 30.3128 30.0116 30.2163C30.3592 30.1198 30.6822 29.9521 30.9609 29.7233C31.237 29.5015 31.4944 29.1719 31.6622 28.8575L32.9354 26.5052L33.8913 27.0483L32.5997 29.4589C32.3633 29.9014 32.0415 30.2899 31.6528 30.602C30.939 31.1738 30.0406 31.4623 29.1215 31.415C28.7115 31.3988 28.3057 31.3115 27.9219 31.157L18.2908 48.8176L17.3338 48.2748L26.9556 30.609ZM32.9354 26.5052L31.9751 25.9613L31.9787 25.9544L29.0894 24.3168L29.0864 24.3226L28.1247 23.777L27.1686 23.2346L28.4598 20.8228C28.7013 20.376 29.019 19.9948 29.4154 19.6785C29.807 19.3636 30.2456 19.1382 30.731 19.0013C31.1279 18.8894 31.5331 18.841 31.9443 18.857C32.3525 18.8804 32.7503 18.97 33.1388 19.1243L42.4636 2.20738L43.4191 2.74925L34.1039 19.6727C34.4391 19.9277 34.7247 20.2258 34.9613 20.5681C35.1933 20.9169 35.3691 21.2948 35.488 21.6992C35.6325 22.1879 35.6801 22.6987 35.6281 23.202C35.5807 23.7086 35.4327 24.1982 35.1929 24.6414L33.8921 27.0467L32.9354 26.5052ZM31.0431 20.0677C30.7007 20.1629 30.3818 20.3264 30.1049 20.5487C29.8271 20.7744 29.5966 21.0536 29.4261 21.3708L28.6474 22.8174L33.4479 25.54L34.2266 24.0934C34.3986 23.7785 34.5061 23.4307 34.5429 23.0703C34.5797 22.71 34.545 22.3442 34.4408 21.9946C34.3378 21.6368 34.1646 21.3024 33.9317 21.0115C33.7067 20.7332 33.4336 20.4984 33.1262 20.3192C32.8147 20.147 32.4756 20.0342 32.1261 19.9865C31.7641 19.9395 31.4029 19.9662 31.0431 20.0677Z"
        fill="white"
      />
    </g>
  </svg>
)

const ConnectionBubble: React.FC = () => {
  const { connection } = useConnection()
  const currentConnectionHash = useSettingsHash(connection.id)
  const connectionsHash = useSettingsHash()
  return (
    <Box rounded>
      <Flex gap={1}>
        <BlockLink href={currentConnectionHash}>
          <Box bg roundedLeft className={classes.currentConnectionContainer}>
            <Flex justifyContent="space-between" alignItems="center" gap={3}>
              <div className={classes.blockieStack}>
                <Box rounded className={classes.blockieBox}>
                  <Blockie
                    address={connection.pilotAddress}
                    className={classes.blockie}
                  />
                </Box>
                {connection.moduleAddress && (
                  <Box rounded className={classes.blockieBox}>
                    <Blockie
                      address={connection.moduleAddress}
                      className={classes.blockie}
                    />
                  </Box>
                )}
                <Box rounded className={classes.blockieBox}>
                  <Blockie
                    address={connection.avatarAddress}
                    className={classes.blockie}
                  />
                </Box>
              </div>
              <p className={classes.label}>{connection.label}</p>
            </Flex>
            <div className={classes.infoContainer}>
              <Box bg rounded p={3} className={classes.info}>
                <ConnectionStack staticLabels connection={connection} />
              </Box>
            </div>
          </Box>
        </BlockLink>
        <BlockLink href={connectionsHash}>
          <Box bg roundedRight className={classes.connectionsContainer}>
            <ConnectionsIcon width="48" height="48" />
          </Box>
        </BlockLink>
      </Flex>
    </Box>
  )
}

export default ConnectionBubble
