'use client';

import { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/page';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Save, 
  Camera, 
  ShieldCheck, 
  X,
  Crown,
  Stethoscope,
  UserCheck,
  Edit3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Customer {
  id: number;
  email: string | null;
  name: string;
  phone: string | null;
  gender: 'Nam' | 'Nữ' | 'Khác' | null;
  birthday: string | null;
  avatar: string | null;
  address: string | null;
  role_id: number;
}

interface Certificate {
  id: number;
  filename: string;
  source: string;
}

interface Degree {
  id: number;
  filename: string;
  gpa: string | null;
  university: string | null;
  graduation_date: string | null;
  degree_type: string | null;
}

interface Doctor {
  id: number;
  email: string | null;
  name: string;
  phone: string | null;
  introduction: string | null;
  experience: string | null;
  gpa: string | null;
  university: string | null;
  graduation_date: string | null;
  degree_type: string | null;
  img: string | null; // avatar của bác sĩ
  degree_image: string | null;
  certificate_image: string | null; // raw string from DB
  certificate_source: string | null; // raw string from DB
  account_status: string | null;
  role_id: number;
  specialization_id: number | null;
  room_number: string | null;
  price: string | null;
  specialization_name: string | null;
  Certificates: Certificate[];
  Degrees: Degree[];
}

type ProfileData = Customer | Doctor;

const getRoleInfo = (roleId: number) => {
  switch (roleId) {
    case 1:
      return { name: 'Quản trị viên', icon: Crown, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' };
    case 2:
      return { name: 'Khách hàng', icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    case 3:
      return { name: 'Bác sĩ', icon: Stethoscope, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    default:
      return { name: 'Người dùng', icon: User, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
  }
};

// Component cho mỗi dòng thông tin, giúp code gọn hơn
const ProfileField = ({ 
  label, 
  children, 
  icon: Icon,
  isVerified = false,
  isRequired = false 
}: { 
  label: string, 
  children: React.ReactNode, 
  icon?: any,
  isVerified?: boolean,
  isRequired?: boolean 
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
    {Icon && (
      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon size={20} className="text-blue-600" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {isRequired && <span className="text-red-500">*</span>}
        {isVerified && (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle size={12} />
            Đã xác thực
          </span>
        )}
      </div>
      <div className="text-gray-900">{children}</div>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user: authUser, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<any>({}); // Use any for simplicity due to complex union types
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const degreeImageRef = useRef<HTMLInputElement>(null);
  const certificateFilesRef = useRef<HTMLInputElement>(null);

  const [degreeImageFile, setDegreeImageFile] = useState<File | null>(null);
  const [degreeImagePreview, setDegreeImagePreview] = useState<string | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [certificatePreviews, setCertificatePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading || !authUser || !token) return;

    const fetchData = async () => {
      try {
        setPageLoading(true);
        setError(null);
        
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        let fetchedData: any; // Use any to simplify type handling for fetched data

        if (localUser.role_id === 1) { // Admin
          fetchedData = { ...localUser, name: localUser.name || 'Admin', email: localUser.email || '', role_id: 1 };
        } else if (localUser.role_id === 3) {
          const res = await fetch(`${API_URL}/api/doctors/${localUser.id}`);
          if (!res.ok) throw new Error('Không thể tải thông tin bác sĩ');
          const result = await res.json();
          fetchedData = result; // API bác sĩ trả về object trực tiếp
        } else { // Customer
          const res = await fetch(`${API_URL}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Không thể tải thông tin người dùng');
          const result = await res.json();
          fetchedData = result.data;
        }

        setProfileData(fetchedData as ProfileData); // Cast to ProfileData for setProfileData
        setFormData({ 
          ...fetchedData,
          birthday: fetchedData.birthday ? fetchedData.birthday.split('T')[0] : null,
          graduation_date: fetchedData.graduation_date ? fetchedData.graduation_date.split('T')[0] : null
        });

        // Khởi tạo preview cho ảnh hiện tại
        if (fetchedData.avatar) {
          setAvatarPreview(`${API_URL}${fetchedData.avatar}`);
        } else if (fetchedData.img) {
          setAvatarPreview(`${API_URL}/uploads/${fetchedData.img}`);
        }

        if (fetchedData.degree_image) {
          setDegreeImagePreview(`${API_URL}/uploads/${fetchedData.degree_image}`);
        }
        if (fetchedData.certificate_image) {
          const certImages = fetchedData.certificate_image.split(',').map((imgName: string) => `${API_URL}/uploads/${imgName}`);
          setCertificatePreviews(certImages);
        }

      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError(err.message || 'Không thể tải dữ liệu hồ sơ.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [authLoading, authUser, token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileType: 'avatar' | 'degree' | 'certificate') => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (fileType === 'avatar') {
        setAvatarFile(files[0]);
        setAvatarPreview(URL.createObjectURL(files[0]));
      } else if (fileType === 'degree') {
        setDegreeImageFile(files[0]);
        setDegreeImagePreview(URL.createObjectURL(files[0]));
      } else if (fileType === 'certificate') {
        setCertificateFiles(files);
        setCertificatePreviews(files.map(file => URL.createObjectURL(file)));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profileData) return; // Guard clause

    const currentProfile: ProfileData = profileData; // Explicitly assert type here

    const dataToUpdate = new FormData();

    // Helper function for safe string comparison and FormData appending
    const appendIfChanged = (key: string, newVal: any, oldVal: any) => {
      const normalizedNew = String(newVal || '').trim();
      const normalizedOld = String(oldVal || '').trim();
      if (normalizedNew !== normalizedOld) {
        dataToUpdate.append(key, normalizedNew);
      }
    };

    // Generic fields (common to both Customer and Doctor)
    appendIfChanged('name', formData.name, currentProfile.name);
    appendIfChanged('email', formData.email, currentProfile.email);
    appendIfChanged('phone', formData.phone, currentProfile.phone);

    if (currentProfile.role_id === 3) {
      // Logic cho Bác sĩ
      const doctorFormData = formData as Partial<Doctor>;
      const doctorProfile = currentProfile as Doctor;

      appendIfChanged('introduction', doctorFormData.introduction, doctorProfile.introduction);
      appendIfChanged('experience', doctorFormData.experience, doctorProfile.experience);
      appendIfChanged('gpa', doctorFormData.gpa, doctorProfile.gpa);
      appendIfChanged('university', doctorFormData.university, doctorProfile.university);
      
      // Date fields
      const newGraduationDate = doctorFormData.graduation_date ? doctorFormData.graduation_date.split('T')[0] : null;
      const originalGraduationDate = doctorProfile.graduation_date ? doctorProfile.graduation_date.split('T')[0] : null;
      if (newGraduationDate !== originalGraduationDate) {
        dataToUpdate.append('graduation_date', newGraduationDate || '');
      }

      appendIfChanged('degree_type', doctorFormData.degree_type, doctorProfile.degree_type);
      appendIfChanged('specialization_id', String(doctorFormData.specialization_id), String(doctorProfile.specialization_id));
      appendIfChanged('room_number', doctorFormData.room_number, doctorProfile.room_number);
      appendIfChanged('price', doctorFormData.price, doctorProfile.price);
      appendIfChanged('certificate_source', doctorFormData.certificate_source, doctorProfile.certificate_source);

      // Doctor file uploads
      if (avatarFile) dataToUpdate.append('img', avatarFile);
      if (degreeImageFile) dataToUpdate.append('degree_image', degreeImageFile);
      if (certificateFiles.length > 0) {
        certificateFiles.forEach(file => {
          dataToUpdate.append('certificate_files', file);
        });
      }

    } else {
      // Logic cho Khách hàng (Customer) hoặc Admin (nếu họ có profile tương tự customer)
      const customerFormData = formData as Partial<Customer>;
      const customerProfile = currentProfile as Customer;

      appendIfChanged('gender', customerFormData.gender, customerProfile.gender);
      
      // Date fields
      const newBirthday = customerFormData.birthday ? customerFormData.birthday.split('T')[0] : null;
      const originalBirthday = customerProfile.birthday ? customerProfile.birthday.split('T')[0] : null;
      if (newBirthday !== originalBirthday) {
        dataToUpdate.append('birthday', newBirthday || '');
      }
      appendIfChanged('address', customerFormData.address, customerProfile.address);

      // Customer file upload
      if (avatarFile) dataToUpdate.append('avatar', avatarFile);
    }

    if (Array.from(dataToUpdate.keys()).length === 0) {
      alert('Không có thông tin nào thay đổi.');
      return;
    }

    try {
      setIsSubmitting(true);
      let apiUrl = '';
      if (currentProfile.role_id === 3) {
        apiUrl = `${API_URL}/api/doctors/${currentProfile.id}/profile`;
      } else {
        apiUrl = `${API_URL}/api/users/profile`;
      }

      const res = await fetch(apiUrl, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: dataToUpdate });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Cập nhật thất bại.');
      alert('Cập nhật thành công!');
      window.dispatchEvent(new Event("userChanged"));
      window.location.reload();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDateForDisplay = (isoDateString: string | null | undefined): string => {
    if (!isoDateString) return 'Chưa thiết lập';
    try {
        const date = new Date(isoDateString);
        // Adjust for timezone offset to get local date
        const userTimezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        const localDate = new Date(date.getTime() - userTimezoneOffset);
        return localDate.toISOString().split('T')[0].split('-').reverse().join('/');
    } catch (e) {
        console.error("Lỗi định dạng ngày:", e);
        return 'Ngày không hợp lệ';
    }
  };

  // Dùng `profileData.img` cho bác sĩ, `profileData.avatar` cho khách hàng
  const displayAvatar = avatarPreview || (
    profileData && 'avatar' in profileData && profileData.avatar 
      ? `${API_URL}${profileData.avatar}` 
      : (profileData && 'img' in profileData && profileData.img 
        ? `${API_URL}/uploads/${profileData.img}` 
        : 'https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg'
      )
  );

  const roleInfo = profileData ? getRoleInfo(profileData.role_id) : getRoleInfo(authUser?.role_id || 2);
  const RoleIcon = roleInfo.icon;
  const isDoctor = profileData?.role_id === 3;

  if (pageLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-10">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );
  
  if (!profileData || !profileData.id) return (
    <div className="text-center py-10">
      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">Không thể hiển thị thông tin người dùng.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit3 size={16} />
          {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Profile Overview Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <img 
                src={displayAvatar} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => { e.currentTarget.src = 'https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg'; }}
              />
              {isEditing && (
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center border-4 border-white hover:bg-blue-700 transition shadow-lg"
                  aria-label="Thay đổi ảnh đại diện"
                >
                  <Camera size={16} />
                </button>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" />
            </div>
            
            {/* User Info */}
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${roleInfo.bgColor} ${roleInfo.color} ${roleInfo.borderColor} border`}>
                  <RoleIcon size={16} />
                  {roleInfo.name}
                </div>
                {'account_status' in profileData && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-200">
                    <CheckCircle size={16} />
                    {profileData.account_status === 'active' ? 'Tài khoản hoạt động' : 'Chờ duyệt'}
                  </div>
                )}
              </div>
              <p className="text-gray-600">{profileData.email}</p>
            </div>
          </div>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileField label="Họ và Tên" icon={User} isRequired>
            {isEditing ? (
              <input 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Nhập họ và tên"
              />
            ) : (
              <p className="text-lg font-medium">{profileData.name}</p>
            )}
          </ProfileField>

          <ProfileField label="Email" icon={Mail} isVerified>
            <div className="flex items-center gap-3">
              <p className="text-lg font-medium">{profileData.email}</p>
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ShieldCheck size={12} />
                Đã xác thực
              </span>
            </div>
          </ProfileField>

          <ProfileField label="Số điện thoại" icon={Phone}>
            {isEditing ? (
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <p className="text-lg">{profileData.phone || 'Chưa thiết lập'}</p>
            )}
          </ProfileField>

          {'gender' in profileData && (
            <ProfileField label="Giới tính" icon={User}>
              {isEditing ? (
                <div className="flex gap-6">
                  {['Nam', 'Nữ', 'Khác'].map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender" 
                        value={option} 
                        checked={(formData as Customer).gender === option} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(p => ({...p, gender: e.target.value as any}))} 
                        className="form-radio text-blue-600 h-4 w-4 focus:ring-blue-500"
                      />
                      <span className="text-lg">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-lg">{(profileData as Customer).gender || 'Chưa thiết lập'}</p>
              )}
            </ProfileField>
          )}

          {'birthday' in profileData && (
            <ProfileField label="Ngày sinh" icon={Calendar}>
              {isEditing ? (
                <input 
                  type="date" 
                  name="birthday" 
                  value={(formData as Customer).birthday || ''} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <p className="text-lg">{formatDateForDisplay((profileData as Customer).birthday)}</p>
              )}
            </ProfileField>
          )}
          
          {isDoctor && (
            <>
              <ProfileField label="Chuyên khoa" icon={Stethoscope}>
                <p className="text-lg">{(profileData as Doctor).specialization_name || 'Chưa thiết lập'}</p>
              </ProfileField>
              <ProfileField label="Số phòng khám" icon={User}>
                {isEditing ? (
                  <input 
                    name="room_number" 
                    value={(formData as Doctor).room_number || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    placeholder="Nhập số phòng khám"
                  />
                ) : (
                  <p className="text-lg">{(profileData as Doctor).room_number || 'Chưa thiết lập'}</p>
                )}
              </ProfileField>
              <ProfileField label="Giá khám" icon={Mail}>
                {isEditing ? (
                  <input 
                    name="price" 
                    value={(formData as Doctor).price || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    placeholder="Nhập giá khám"
                  />
                ) : (
                  <p className="text-lg">{(profileData as Doctor).price ? `${(profileData as Doctor).price} VNĐ` : 'Chưa thiết lập'}</p>
                )}
              </ProfileField>
              <ProfileField label="Giới thiệu" icon={User}>
                {isEditing ? (
                  <textarea 
                    name="introduction" 
                    value={(formData as Doctor).introduction || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-24" 
                    placeholder="Giới thiệu về bản thân và kinh nghiệm"
                  />
                ) : (
                  <p className="text-lg">{(profileData as Doctor).introduction || 'Chưa thiết lập'}</p>
                )}
              </ProfileField>
              <ProfileField label="Kinh nghiệm" icon={User}>
                {isEditing ? (
                  <textarea 
                    name="experience" 
                    value={(formData as Doctor).experience || ''} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-24" 
                    placeholder="Kinh nghiệm làm việc"
                  />
                ) : (
                  <p className="text-lg">{(profileData as Doctor).experience || 'Chưa thiết lập'}</p>
                )}
              </ProfileField>
              <ProfileField label="Bằng cấp và Học vấn" icon={User}>
                {isEditing ? (
                  <>
                    <input type="file" accept="image/*" ref={degreeImageRef} onChange={(e) => handleFileChange(e, 'degree')} className="hidden" />
                    <button 
                      type="button" 
                      onClick={() => degreeImageRef.current?.click()}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Tải lên bằng cấp
                    </button>
                    {degreeImagePreview && <img src={degreeImagePreview} alt="Bằng cấp" className="mt-2 max-h-40 object-contain" />}
                    <input 
                      name="university" 
                      value={(formData as Doctor).university || ''} 
                      onChange={handleChange} 
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                      placeholder="Trường đại học"
                    />
                    <input 
                      name="gpa" 
                      value={(formData as Doctor).gpa || ''} 
                      onChange={handleChange} 
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                      placeholder="Điểm trung bình (GPA)"
                    />
                    <input 
                      type="date" 
                      name="graduation_date" 
                      value={(formData as Doctor).graduation_date || ''} 
                      onChange={handleChange} 
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:focus:border-blue-500 transition"
                    />
                    <input 
                      name="degree_type" 
                      value={(formData as Doctor).degree_type || ''} 
                      onChange={handleChange} 
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                      placeholder="Loại bằng cấp (ví dụ: Giỏi, Khá)"
                    />
                  </>
                ) : (
                  <div>
                    {profileData && 'Degrees' in profileData && profileData.Degrees.length > 0 ? (
                      profileData.Degrees.map((degree, index) => (
                        <div key={index} className="mb-2 p-2 border rounded-md">
                          {degree.filename && <img src={`${API_URL}/uploads/${degree.filename}`} alt="Bằng cấp" className="max-h-40 object-contain mb-2" />}
                          <p><strong>Trường:</strong> {degree.university || 'Chưa thiết lập'}</p>
                          <p><strong>GPA:</strong> {degree.gpa || 'Chưa thiết lập'}</p>
                          <p><strong>Ngày tốt nghiệp:</strong> {formatDateForDisplay(degree.graduation_date) || 'Chưa thiết lập'}</p>
                          <p><strong>Loại bằng:</strong> {degree.degree_type || 'Chưa thiết lập'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-lg">Chưa thiết lập</p>
                    )}
                  </div>
                )}
              </ProfileField>

              <ProfileField label="Chứng chỉ & Giấy phép" icon={User}>
                {isEditing ? (
                  <>
                    <input type="file" multiple accept="image/*" ref={certificateFilesRef} onChange={(e) => handleFileChange(e, 'certificate')} className="hidden" />
                    <button 
                      type="button" 
                      onClick={() => certificateFilesRef.current?.click()}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Tải lên chứng chỉ
                    </button>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      {certificatePreviews.map((src, index) => (
                        <img key={index} src={src} alt={`Chứng chỉ ${index + 1}`} className="max-h-40 object-contain" />
                      ))}
                    </div>
                    {/* Input cho nguồn cấp chứng chỉ (nếu cần) */}
                    <textarea 
                      name="certificate_source" 
                      value={(formData as Doctor).certificate_source || ''} 
                      onChange={handleChange} 
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                      placeholder="Nơi cấp chứng chỉ (cách nhau bởi dấu phẩy)"
                    />
                  </>
                ) : (
                  <div>
                    {profileData && 'Certificates' in profileData && profileData.Certificates.length > 0 ? (
                      profileData.Certificates.map((cert, index) => (
                        <div key={index} className="mb-2 p-2 border rounded-md">
                          {cert.filename && <img src={`${API_URL}/uploads/${cert.filename}`} alt="Chứng chỉ" className="max-h-40 object-contain mb-2" />}
                          <p><strong>Nơi cấp:</strong> {cert.source || 'Chưa thiết lập'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-lg">Chưa thiết lập</p>
                    )}
                  </div>
                )}
              </ProfileField>
            </>
          )}

        </div>

        {/* Submit Button */}
        {isEditing && (
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}