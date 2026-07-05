import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { generateQR } from '../lib/qrcode';

interface Props {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 200 }: Props) {
  const { data, size: moduleCount } = generateQR(value);
  const cellSize = size / moduleCount;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((row, r) =>
          row.map((dark, c) =>
            dark ? (
              <Rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#000"
              />
            ) : null
          )
        )}
      </Svg>
    </View>
  );
}
