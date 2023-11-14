export const getBase64 = (file: Blob): Promise<string> => {
  return new Promise((resolve) => {
    let baseURL = ''
    let reader = new FileReader()

    // convert the file to base64 text
    reader.readAsDataURL(file)

    reader.onload = () => {
      baseURL = reader.result as string

      resolve(baseURL)
    }
  })
}
