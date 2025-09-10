import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { getDocList } from "@/api/action";
import { formatParagraphs } from "@/utils/index";
import { Font, Margin, Column, Language } from "@/types";
import { sendMessageStream } from "@/api/index";
import { data } from "@/utils/text";

type ThemeContextType = {
  pageData: any;
  id: string;
  title: string;
  outline: any[];
  length: number;
  isAiVoice: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;

  setIdnum: React.Dispatch<React.SetStateAction<number>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ReadingProvider = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<any[]>([]);
  const [page, setPage] = useState(16);
  const [title, setTitle] = useState<string>("");
  const [outline, setOutline] = useState<any[]>([]);
  const [length, setLength] = useState<number>(0);
  const [idnum, setIdnum] = useState(0);
  const [language, setLanguage] = useState<Language>("");
  const isAiVoice = true;

  const pageData = useMemo(() => {
    return book.find((res) => res.page === page);
  }, [book, page]);

  useEffect(() => {
    const init = async () => {
      const sheet = await getDocList(
        "studio.sheet",
        [["id", "=", Number(id)]],
        ["name", "outline"]
      );
      console.log("sheet: ", sheet);
      const data = await getDocList(
        "studio.page",
        [["book_id", "=", Number(id)]],
        ["text", "page", "idnum"]
      );

      setIsLoading(false);
      if (sheet.length) setTitle(sheet[0].name);
      if (sheet.length) setOutline(sheet[0].outline);

      if (data.length) setBook(data);
      if (data.length) setLength(data.length);
    };
    setIsLoading(true);
    init();
  }, []);

  useEffect(() => {
    if (idnum <= 0) return;
    const target_page = book.find((res) => res.idnum == idnum)?.page;
    if (target_page) setPage(target_page);
  }, [idnum]);

  return (
    <ThemeContext.Provider
      value={{
        pageData: { text: pageData?.text || "", data: data },
        isAiVoice,
        id,
        title,
        outline,
        length,
        setIdnum,
        language,
        isLoading,
        setIsLoading,
        page,
        setPage,
        setLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useReadingContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useReadingContext must be used within ReadingProvider");
  }
  return context;
};
