import React from 'react';
import SearchBar from '../shared/components/navigation/Search';

export default function MainLayout() {
  return (
    <div className="flex justify-center content-center items-center min-h-screen bg-gray-800/90 text-white">
      <SearchBar query="" onQueryChange={() => {}} />
    </div>
  );
}
