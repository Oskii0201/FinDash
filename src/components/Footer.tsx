import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-darkNavy py-4 text-center text-offWhite">
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <Link
          href="https://github.com/Oskii0201/FinDash"
          target="_blank"
          rel="noopener noreferrer"
          className="text-jonquil hover:underline"
        >
          FinDash.
        </Link>{" "}
        All rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
