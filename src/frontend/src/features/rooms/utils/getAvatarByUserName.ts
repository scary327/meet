const avatarImages = [
  '/avatars/img1.svg',
  '/avatars/img2.svg',
  '/avatars/img3.svg',
  '/avatars/img4.svg',
  '/avatars/img5.svg',
  '/avatars/img6.svg',
]

export const getAvatarByUserName = (username: string): string => {
  // Простая хеш-функция из строки в число
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % avatarImages.length
  return avatarImages[index]
}
