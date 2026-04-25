import { createContext, useContext , useState , useEffect} from "react";

const ThemeContext =createContext();

export function ThemeProvider({children}){
    const [dark, setDark]= useState(true);

    useEffect(()=>{
        const root= document.documentElement;
        if(dark){
            root.classList.add('dark');
            document.body.style.background='#070B14';
            document.body.style.color='#f0f0f0';
        
        }else{
            root.classList.remove('dark');
            document.body.style.backgroundColor='#f8f5f0';
            document.body.style.color = '#1a1a1a';
        }
    },[dark]);

    const toggle =()=> setDark((d)=>!d);

    return(
        <ThemeContext.Provider value={{dark,toggle}}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);