export function downloadFile(file) {
  if (!(file instanceof File)) {
    throw new Error("File is not instance of File");
  }
  const url = window.URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  window.URL.revokeObjectURL(url);
}
