const renderIconPromotion = (primary) => {
  return (
    <svg
      width={16}
      height={16}
      viewBox='0 0 218 218'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M113.543 10.9749C115.308 10.9749 117.005 11.8333 118.251 13.3539L206.685 121.239C208.52 123.937 209.363 127.273 209.04 130.743C208.775 133.612 207.823 136.249 205.881 138.995L152.497 203.202C150.443 205.699 147.691 207.098 144.826 207.101C142.118 207.101 139.852 205.9 137.037 203.202L135.369 201.547L144.6 189.995L188.125 137.696C189.773 135.317 190.588 132.472 190.588 129.149C190.634 127.65 190.417 126.157 189.951 124.776C189.485 123.394 188.781 122.157 187.89 121.154L107.353 23.3478C103.468 18.8107 99.4559 15.6102 95.3261 13.7463C93.0137 12.7188 90.6385 11.9273 88.2239 11.3796L86.9388 11.0976C86.5955 11.0117 86.5857 10.9872 87.0075 10.9749H113.543ZM79.7876 10.9014C81.5533 10.9014 83.2504 11.7597 84.4962 13.2803L172.93 121.166C174.755 123.864 175.608 127.187 175.285 130.657C175.02 133.526 174.068 136.175 172.126 138.91L118.732 203.116C116.679 205.618 113.928 207.021 111.061 207.028C108.363 207.028 105.842 205.826 103.036 203.128L14.9261 98.7745C14.2949 98.0353 13.791 97.143 13.4452 96.152C13.0994 95.161 12.919 94.0922 12.9151 93.0111V27.5538C12.817 23.4582 13.6607 19.7181 15.5637 16.6402C17.8199 13.0105 21.2337 11.1957 25.6579 10.9014H79.7876ZM56.5075 43.6014C47.875 43.6014 38.2714 51.9072 38.2714 62.4407C38.2714 72.9619 47.875 80.62 56.5075 80.62C65.14 80.62 74.2091 72.9619 74.2091 62.4407C74.2091 51.9072 65.14 43.6014 56.5075 43.6014Z'
        fill={primary}
      />
    </svg>
  );
};

const renderIconEdit = (primary) => (
  <svg width={16} height={16} viewBox='0 0 1280 1280' fill='none'>
    <path
      d='M906.668 160.013C920.676 146.006 937.305 134.894 955.607 127.313C973.909 119.732 993.525 115.831 1013.33 115.831C1033.14 115.831 1052.76 119.732 1071.06 127.313C1089.36 134.894 1105.99 146.006 1120 160.013C1134.01 174.021 1145.12 190.651 1152.7 208.952C1160.28 227.254 1164.18 246.87 1164.18 266.68C1164.18 286.49 1160.28 306.106 1152.7 324.408C1145.12 342.71 1134.01 359.339 1120 373.347L400.001 1093.35L106.668 1173.35L186.668 880.013L906.668 160.013Z'
      stroke={primary}
      strokeWidth={106.824}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
const renderIconInformation = (primary, size = '20') => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 128 129'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M64.0001 118.143C93.4553 118.143 117.333 94.2646 117.333 64.8094C117.333 35.3542 93.4553 11.4761 64.0001 11.4761C34.5449 11.4761 10.6667 35.3542 10.6667 64.8094C10.6667 94.2646 34.5449 118.143 64.0001 118.143Z'
        stroke={primary}
        strokeWidth='10.6824'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M64.0007 86.1449V64.8115'
        stroke={primary}
        strokeWidth='15.2432'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M64.0007 43.478H64.0541'
        stroke={primary}
        strokeWidth='14.2432'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
const IconRewards = () => {
  return (
    <svg
      width='246'
      height='246'
      viewBox='0 0 246 246'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='123' cy='123' r='123' fill='#D9D9D9' />
      <mask
        id='mask0_6723_69406'
        style={{ maskType: 'alpha' }}
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='246'
        height='246'
      >
        <circle cx='123' cy='123' r='123' fill='#D9D9D9' />
      </mask>
      <g mask='url(#mask0_6723_69406)'>
        <path d='M208.5 142H44L57.5 246H200L208.5 142Z' fill='white' />
        <path
          d='M126.04 111.092L122.489 115.954C122.489 115.954 119.128 83.7166 128.846 67.1216C135.437 55.866 152.741 43.7859 152.741 43.7859L165.928 55.5595C130.515 76.1045 126.136 85.9672 126.04 111.092Z'
          fill='#8A8D8E'
        />
        <path
          d='M177.736 58.4037C170.405 84.9838 161.493 113.733 116.496 127.206L117.468 117.203C144.756 98.6539 150.884 81.3735 152.717 43.7301L177.736 58.4037Z'
          fill='#C1C1C1'
        />
        <path d='M121 246L116 142H137.152L141 246H121Z' fill='#8A8D8E' />
        <path opacity='0.2' d='M202 142L48.5 178.5L44 142H202Z' fill='black' />
        <path
          d='M209.128 97.5799L21.6437 132.859L30.2768 162.992L211.981 127.254L209.128 97.5799Z'
          fill='white'
        />
        <path
          d='M82.8158 121.274L72.4596 123.274C72.4596 123.274 59.6144 117.384 52.303 112.152C43.863 106.112 32.9696 93.9178 32.9696 93.9178L47.5853 83.9738L82.8158 121.274Z'
          fill='#8A8D8E'
        />
        <path
          d='M109.95 116.154L103.48 116.776C103.48 116.776 63.8613 78.4692 60.5737 70.1013C56.7787 60.4417 54.2743 44.2833 54.2743 44.2833L71.9476 43.8928C82.3574 75.8041 90.7008 93.3064 109.95 116.154Z'
          fill='#8A8D8E'
        />
        <path
          d='M35.4204 77.6085C62.9856 76.9681 83.5351 76.4998 109.405 115.704L99.5464 117.657L32.4241 93.468L35.4204 77.6085Z'
          fill='#C1C1C1'
        />
        <path
          d='M94.1744 38.1965C115.369 55.8329 130.515 66.724 124.241 113.274L113.789 114.279C113.789 114.279 109.103 89.2634 103.922 79.5633C97.7966 68.0968 55.7989 44.0046 55.7989 44.0046L94.1744 38.1965Z'
          fill='#C1C1C1'
        />
        <path
          d='M113.371 146.969L103.437 116.325L126.833 112.522L138.152 143.033L113.371 146.969Z'
          fill='#8A8D8E'
        />
        <path d='M218 129L234.5 111L236.5 121.5L218 129Z' fill='#8A8D8E' />
        <path
          d='M217 131.938L240.736 126.206L236.537 136.036L217 131.938Z'
          fill='#8A8D8E'
        />
        <path
          d='M217 136.266L240.129 144.096L231.329 150.164L217 136.266Z'
          fill='#8A8D8E'
        />
      </g>
    </svg>
  );
};

export {
  renderIconEdit,
  renderIconPromotion,
  renderIconInformation,
  IconRewards,
};
