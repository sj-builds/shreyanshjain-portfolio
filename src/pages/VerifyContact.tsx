import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { ShieldCheck, XCircle } from "lucide-react";

import { CustomCursor } from "@/components/CustomCursor";



export function VerifyContact() {


  const [status, setStatus] =
    useState<
      "loading" |
      "success" |
      "error"
    >("loading");





  useEffect(() => {


    async function verify() {


      try {


        const params =
          new URLSearchParams(
            window.location.search
          );



        const token =
          params.get("token");



        if (!token) {

          throw new Error();

        }




        const res =
          await fetch(
            `/api/verify-contact?token=${token}`
          );



        const data =
          await res.json();




        if (!data.success) {

          throw new Error();

        }



        setStatus("success");


      }


      catch {


        setStatus("error");


      }


    }



    verify();


  }, []);






  return (

    <>


      <CustomCursor />



      <main
        className="
        min-h-screen
        bg-background
        grid
        place-items-center
        px-6
        "
      >


        <motion.div

          initial={{
            opacity:0,
            y:20,
          }}


          animate={{
            opacity:1,
            y:0,
          }}


          className="
          glass-strong
          max-w-md
          w-full
          rounded-2xl
          p-10
          text-center
          space-y-5
          "
        >



          {status === "loading" && (

            <>

              <ShieldCheck
                className="
                mx-auto
                animate-pulse
                "
                size={48}
              />


              <h1
                className="
                font-display
                text-3xl
                "
              >

                Verifying Channel

              </h1>


              <p className="text-muted-foreground">

                Authenticating your secure transmission...

              </p>

            </>

          )}







          {status === "success" && (

            <>

              <ShieldCheck
                className="mx-auto"
                size={48}
              />


              <h1
                className="
                font-display
                text-3xl
                "
              >

                Transmission Verified

              </h1>


              <p className="text-muted-foreground">

                Your message has been securely delivered.
                I will respond soon.

              </p>

            </>

          )}









          {status === "error" && (

            <>

              <XCircle
                className="mx-auto"
                size={48}
              />


              <h1
                className="
                font-display
                text-3xl
                "
              >

                Verification Failed

              </h1>



              <p className="text-muted-foreground">

                This link is invalid or expired.

              </p>


            </>

          )}




        </motion.div>


      </main>


    </>

  );

}