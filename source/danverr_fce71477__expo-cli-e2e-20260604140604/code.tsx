import { Button } from 'heroui-native'
import { Check } from 'lucide-react-native'
import { Text, View } from 'react-native'
import badge from './expo-cli-e2e-20260604140604-utils/badge.json'
import { palette } from './expo-cli-e2e-20260604140604-utils/colors'
import { formatTitle } from './expo-cli-e2e-20260604140604-utils/format'
import { useAccentColor } from './expo-cli-e2e-20260604140604-utils/useAccent'

export default function ExpoCliCard() {
  const accent = useAccentColor()

  return (
    <View style={{ padding: 20, gap: 12, backgroundColor: palette.surface }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Check color={accent} size={20} />
        <Text style={{ color: palette.ink, fontSize: 18, fontWeight: '700' }}>
          {formatTitle(badge.label)}
        </Text>
      </View>
      <Button>
        <Text>Published from CLI</Text>
      </Button>
    </View>
  )
}
