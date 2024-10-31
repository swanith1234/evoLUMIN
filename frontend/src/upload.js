const url = "https://api.cloudinary.com/v1_1/dgthxi1sd/auto/upload";
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chatAppFile");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();
  return responseData;
};
