import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
export const url = "https://www.bhieu.com";
export async function blobToBase64(blob: any) {
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string; // "data:application/pdf;base64,JVBERi0x…"
      const base64 = dataUrl?.split(",")[1]; // cắt bỏ prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  return base64Data;
}

export const handlePickDocument = async () => {
  const docRes = await DocumentPicker.getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });

  if (docRes.canceled || !docRes.assets?.length) return;

  const pdf = docRes.assets[0];

  const blobRes = await axios.get(pdf.uri, { responseType: "blob" });
  const base64Data = await blobToBase64(blobRes.data);

  const res = await axios.post(url + "/api/method/studio.sheet/upload_pdf", {
    params: { pdf_base64: base64Data },
  });

  console.log("res: ", res.data);
};

export const getDocList = async (
  model_name: string,
  filters: any[] = [],
  fields: any[] = ["name"]
) => {
  try {
    const res = await axios.get(url + `/api/resource/${model_name}`, {
      params: {
        filters: JSON.stringify(filters),
        fields: JSON.stringify(fields),
      },
    });

    return res.data;
  } catch (error) {
    console.log("error: ", error);
    return [];
  }
};

export const update_cpage = async (record_id: number, c_page: number) => {
  try {
    const res = await axios.post(
      url + `/api/method/studio.sheet/update_cpage`,
      {
        params: {
          record_id: record_id,
          c_page: c_page,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log("error: ", error);
    return [];
  }
};
