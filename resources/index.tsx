import { GetServerSideProps } from "next";

const ResourcesRedirect = () => null;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/admin/resources/citations",
      permanent: false,
    },
  };
};

export default ResourcesRedirect;
