// import { createContext, ReactNode, useState } from 'react';

// type QuestionsContextType = {
//   sessionId: string | null;
//   setSessionId: (id: string | null) => void;
// };

// const QuestionsContext = createContext<QuestionsContextType | undefined>(
//   undefined
// );

// const QuestionsContextProvider = ({ children }: { children: ReactNode }) => {
//   const [sessionId, setSessionId] = useState<string | null>(null);

//   return (
//     <QuestionsContext.Provider value={{ sessionId, setSessionId }}>
//       {children}
//     </QuestionsContext.Provider>
//   );
// };

// export default QuestionsContextProvider;
