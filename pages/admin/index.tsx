import { GetServerSideProps } from "next";
import { isLoggedIn } from "@/utils/auth";
import { NextApiRequest } from "next";

const AdminIndex = () => null;

export default AdminIndex;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const adminData = isLoggedIn(req as NextApiRequest);

  if (!adminData) {
    return {
      redirect: {
        destination: "/admin/auth/sign-in",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/admin/dashboard",
      permanent: false,
    },
  };
};
