

import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className=" bg-gray-50 mt-4 flex justify-center items-center p-4">
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-md shadow-md rounded-2xl p-6 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <Image
                src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" // replace with your image
                alt="Profile"
                fill
                className="rounded-full object-cover border-2 border-orange-400"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Alexa Rawles</h2>
              <p className="text-gray-500 text-sm">alexarawles@gmail.com</p>
            </div>
          </div>
          <button className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
            Edit
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value="Alexa"
              readOnly
              className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-2 text-gray-600"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value="Rawles"
              readOnly
              className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-2 text-gray-600"
            />
          </div>

          {/* User Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <input
              type="text"
              value="Evano"
              readOnly
              className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-2 text-gray-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value="alex32@gmail.com"
              readOnly
              className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-2 text-gray-600"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <div className="relative">
              <select
                className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-2 text-gray-400 appearance-none"
                disabled
              >
                <option>Choose language</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value="1234578"
              readOnly
              className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-2 text-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
