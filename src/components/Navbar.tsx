import { useAuth } from '@/hooks/useAuth';
import { signOut } from '../app/(auth)/signOut'
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,

} from "@nextui-org/react";
import ThemeDropdown from './Theme';
import UploadModal from '@/app/feed/create/post/Modal';

export default function NavbarApp() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Navbar>
      <NavbarBrand>
        <Link href={'/'} className="font-bold text-inherit">Synapse</Link>
      </NavbarBrand>

      <NavbarContent className=" sm:flex gap-" justify="center">

        <NavbarItem >

          <Link href="/search" className='flex items-center'>

            <span className="material-symbols-outlined">
              search
            </span>
            <span className='hidden lg:block'>Search</span>
          </Link>
        </NavbarItem>

        <NavbarItem className=''>

          <Link href="/notifications" className='flex items-center'>
            <span className="material-symbols-outlined">
            notifications
            </span>
            <span className='hidden lg:block'>notifications</span></Link>
        </NavbarItem>

        <NavbarItem className='hidden lg:block'>
          <Link href="/users">users</Link>
        </NavbarItem>
        <NavbarItem>
          <ThemeDropdown />
        </NavbarItem>
        <UploadModal />
      </NavbarContent>



      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            {user && user.photoURL ? (
              <Avatar
                as="button"
                className="transition-transform"
                // color="primary"
                name={user.displayName || "User"}
                size="sm"
                // src={user.photoURL}
                src={`/api/proxy?url=${encodeURIComponent(user.photoURL)}`}
              />
            ) : "..."}
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant='faded'>
            <DropdownItem key="profile" className="h-14 gap-2" textValue='email'>
              <p >Signed in as</p>
              <span className="font-semibold">{user?.email || "Guest"}</span>
            </DropdownItem>
            <DropdownItem
              key="analytics"
              onPress={() => router.push('/profile')}
              textValue='profile'
            >
              <span className="material-symbols-outlined">
                person
              </span>     My Profile


            </DropdownItem>

            <DropdownItem
              key="settings"
              onPress={() => router.push('/settings')}
              textValue='settings'
            >
              <span className="material-symbols-outlined">
                settings
              </span>     My Settings
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={signOut}
              textValue='signout'
            >
              <span className="material-symbols-outlined">
                logout
              </span>  Signout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}






