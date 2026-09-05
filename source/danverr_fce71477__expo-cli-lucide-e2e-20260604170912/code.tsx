import { CheckCircle } from 'lucide-react-native'
import { Text, View } from 'react-native'
import badge from './expo-cli-lucide-e2e-20260604170912-utils/badge.json'
import { palette } from './expo-cli-lucide-e2e-20260604170912-utils/colors'
import { formatTitle } from './expo-cli-lucide-e2e-20260604170912-utils/format'
import { useAccentColor } from './expo-cli-lucide-e2e-20260604170912-utils/useAccent'

export default function ExpoCliLucideCard() {
  const accent = useAccentColor()

  return (
    <View style={{ padding: 24, gap: 12, borderWidth: 1, borderColor: palette.border, borderRadius: 14, backgroundColor: palette.surface }}>
      <CheckCircle color={accent} size={32} />
      <Text style={{ color: palette.ink, fontSize: 20, fontWeight: '800' }}>
        {formatTitle(badge.label)}
      </Text>
      <Text style={{ color: accent, fontSize: 14 }}>Static Expo web export from CLI</Text>
    </View>
  )
}
