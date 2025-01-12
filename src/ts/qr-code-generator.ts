import QRCode from "qrcode";

const MAX_DATA_LENGTH = 4296; // Max data length for make QR-Code

export const createQRCodeAsImage = async (data: string): Promise<string> => {
  if (data.length > MAX_DATA_LENGTH) {
    throw new Error("Too long");
  }

  const isDarkTheme = (): boolean => {
    return document.documentElement.classList.contains("dark");
  };

  const darkTheme = isDarkTheme();

  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "L",
      width: 1000,
      margin: 0,
      color: {
        dark: darkTheme ? "#ffffff" : "#000000", // Light theme
        light: darkTheme ? "#1c232b" : "#ffffff", // Dark theme
      },
    });
    return qrDataURL;
  } catch (error) {
    throw error;
  }
};
