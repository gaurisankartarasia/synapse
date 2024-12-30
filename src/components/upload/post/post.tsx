import * as React from 'react';
import { Button, Image } from "@nextui-org/react"; // Import Image
import { useAuth } from '@/hooks/useAuth';
import { MdAddPhotoAlternate } from "react-icons/md";
import {useRouter} from 'next/navigation' 

export default function App() {
  const { user } = useAuth();
  const router = useRouter();

 const goToUploadPage = () =>{router.push('/post/create')}

  return (
    <div className="m-2"> {/* Added padding for better spacing */}
      <div className="flex items-center">
       
      </div>
      {user ? (
         <Button color="primary" variant='light' radius='sm' onPress={goToUploadPage} endContent={<MdAddPhotoAlternate size={25} />}>
         <span className='text-lg'>Upload photo</span>
       </Button>
      
      ) : (
        null
      )}
    </div>
  );
}