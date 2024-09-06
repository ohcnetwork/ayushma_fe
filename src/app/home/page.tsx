"use client";

import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-green-950">
      <div className="min-h-screen text-white flex items-center justify-center relative z-10 w-screen">
        <ShaderGradientCanvas
          importedFiber={{ ...fiber, ...drei, ...reactSpring }}
          style={{
            position: "absolute",
            top: 0,
            zIndex: -1,
          }}
        >
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23004d1d&color2=%23009378&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.1&uStrength=1.5&uTime=8&wireframe=false"
          />
        </ShaderGradientCanvas>

        <div className="p-5 md:p-20">
          <img
            src="/logo_pure.svg"
            alt="Ayushma"
            className="w-[250px] md:w-[300px]"
          />
          <br />
          <h1 className="text-5xl md:text-7xl font-black break-words">
            {process.env.NEXT_PUBLIC_AI_DESCRIPTION}
          </h1>
          <br />
          <div className="grid md:flex grid-cols-2 gap-4 mt-4">
            <Link
              href="/register"
              className="button-bold md:text-2xl text-center !bg-white"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="button-bold-hollow md:text-2xl text-center !text-white !border-white"
            >
              Login
            </Link>
            <Link
              href="https://github.com/ohcnetwork/ayushma_fe"
              className="button-bold-transparent flex gap-2 items-center md:text-2xl text-center !text-white"
              target="_blank"
            >
              <i className="fab fa-github" />
              Contribute
            </Link>
          </div>
          <div className="inset-x-0 bottom-0 absolute pb-4 px-4 md:px-20 opacity-80">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <Link
                href="https://ohc.network?ref=ayushma"
                className="text-[8px] shrink-0"
                target="_blank"
              >
                Powered By
                <img
                  className="h-10"
                  src="https://cdn.ohc.network/ohc_logo_light.png"
                  alt="OHC logo"
                />
              </Link>
              <div className="text-xs md:w-[500px]">
                Open Healthcare Network is an open-source public utility
                designed by a multi-disciplinary team of innovators and
                volunteers. Open Healthcare Network CARE is a Digital Public
                Good recognised by the United Nations.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
