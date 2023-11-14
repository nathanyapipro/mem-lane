export const getBase64 = (file: Blob) => {
  return new Promise((resolve) => {
    let baseURL = ''
    // Make new FileReader
    let reader = new FileReader()

    // Convert the file to base64 text
    reader.readAsDataURL(file)

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      console.log('Called', reader)
      baseURL = reader.result as string

      resolve(baseURL)
    }
  })
}
