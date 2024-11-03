import Image from "next/image";

import Login from './components/Login'
import FullscreenHandler from "./components/FullScreenHandler";

export default function Home() {
  return (
    <main>
      <div>
        <Login /> 
        {/* <FullscreenHandler /> */}
      </div>
    </main>
  );
}
