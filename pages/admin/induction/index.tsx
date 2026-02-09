import { GetServerSideProps } from "next";

const InductionRedirect = () => null;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/admin/induction/courses",
      permanent: false,
    },
  };
};

export default InductionRedirect;
