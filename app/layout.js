import "./globals.css";
export const metadata={
 title:"Before Thursday — One × Kartel",
 description:"A private little Thursday experience.",
 robots:{index:false,follow:false},
 openGraph:{title:"Before Thursday",description:"One private build. One Thursday.",type:"website"}
};
export const viewport={themeColor:"#090908",width:"device-width",initialScale:1,viewportFit:"cover"};
export default function RootLayout({children}){return <html lang="en"><body>{children}</body></html>}