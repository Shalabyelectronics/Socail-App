import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export default function NoPosts() {
  return (
    <div className="flex justify-center items-center w-full mt-12 px-4">
      <Card className="w-full max-w-[400px] shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
          <div className="p-3 bg-[#5E17EB]/10 rounded-full mb-2">
            <FileQuestion className="w-8 h-8 text-[#5E17EB]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
            No Posts Yet
          </h2>
        </CardHeader>
        
        <Divider />
        
        <CardBody className="py-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            There are no posts available right now. Please try again later!
          </p>
        </CardBody>
        
        <Divider />
        
        <CardFooter className="justify-center pb-6 pt-4 bg-gray-50 dark:bg-gray-900/50">
          <Link 
            to="/profile"
            className="inline-flex items-center justify-center bg-[#FF3131] hover:bg-[#5E17EB] text-white font-medium py-2 px-6 rounded-full transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            Go to your Profile
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}