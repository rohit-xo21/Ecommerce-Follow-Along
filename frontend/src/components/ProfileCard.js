import { Mail } from 'lucide-react';


const ProfileCard = ({ name, email }) => {
    
  return (
    <div className="max-w-sm shadow-lg">
      <div className="flex flex-col items-center text-center py-8 space-y-6">
        
        <h2 className="text-xl font-semibold">
          {name}
        </h2>

        <div className="flex flex-col items-center gap-2 text-gray-600">
          <Mail className="w-5 h-5" />
          <span>{email}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;