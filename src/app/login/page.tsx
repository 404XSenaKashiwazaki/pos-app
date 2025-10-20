import React from "react";
import { Metadata } from "next";
import Form from "./components/form";

export const metadata: Metadata = {
  title: "Login",
};

const page = () => {
  return (
    <div>
      <Form />
    </div>
  );
};

export default page;
