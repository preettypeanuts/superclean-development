import ThemeSwitch from "@shared/components/auth/ThemeSwitch";

export default async function Index() {
  return (
    <div className='container'>
      <div>Welcome to the Admin!</div>
      <div className="min-h-screen bg-muted flex justify-center items-center flex-col gap-2">
        <h1 className="text-4xl dark:text-red-400 text-red-100">Admin Page</h1>
      </div>
      <ThemeSwitch/>
    </div>
  );
}