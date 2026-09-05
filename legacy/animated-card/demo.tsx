import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
} from "./animated-card"
import { Visual1 } from "./animated-card"

export default function AnimatedCard1Demo() {
  return (
    <AnimatedCard>
      <CardVisual>
        <Visual1 mainColor="#ff6900" secondaryColor="#f54900" />
      </CardVisual>
      <CardBody>
        <CardTitle>Just find the right caption</CardTitle>
        <CardDescription>
          This card will tell everything you want
        </CardDescription>
      </CardBody>
    </AnimatedCard>
  )
}
