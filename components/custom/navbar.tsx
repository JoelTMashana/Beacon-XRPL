import Link from 'next/link';

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-gray-800 text-white p-4 shadow-md">
      <ul className="flex space-x-4 justify-center">
        <li>
          <Link href="/" passHref>
            <span className="hover:text-gray-300 cursor-pointer">Home</span>
          </Link>
        </li>
        <li>
          <Link href="/auth/login" passHref>
            <span className="hover:text-gray-300 cursor-pointer">Login</span>
          </Link>
        </li>
        <li>
          <Link href="/auth/register" passHref>
            <span className="hover:text-gray-300 cursor-pointer">Register</span>
          </Link>
        </li>
        <li>
          <Link href="/board" passHref>
            <span className="hover:text-gray-300 cursor-pointer">Board</span>
          </Link>
        </li>
        <li>
          <Link href="/inbox" passHref>
            <span className="hover:text-gray-300 cursor-pointer">Inbox</span>
          </Link>
        </li>
        <li>
          <Link href="/chat" passHref>
            <span className="hover:text-gray-300 cursor-pointer">Chat</span>
          </Link>
        </li>
        <li>
          <Link href="/profile" passHref>
            <span className="hover:text-gray-300 cursor-pointer">Profile</span>
          </Link>
        </li>
        <li>
          <Link href="/promotions" passHref>
            <span className="hover:text-gray-300 cursor-pointer">Promotions</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
