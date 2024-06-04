"use server"

async function UploadImage (ImageBody: any) {
    const response = await fetch ("https://api.cloudinary.com/v1_1/dgmc7qcmk/image/upload",{
        method: 'POST',
        body: ImageBody,
    });

    const data = await response.json();
    return (data);
}

export default UploadImage;