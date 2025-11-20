import { Link } from '@/primitives'
import { AProps } from '@/primitives/A'

export const BackToHome = ({ size }: { size?: AProps['size'] }) => {
  return (
    <p>
      <Link to="/" size={size}>
        Вернуться на главную
      </Link>
    </p>
  )
}
