import { CopyButton } from "@/demos/copyButton";



export const Component = () => {

  return (
    <div  className= "relative" >
    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border rounded-t-lg w-[300px]" >
      <div className="flex space-x-2" >
        <div className="h-3 w-3 rounded-full bg-red-500" > </div>
          < div className = "h-3 w-3 rounded-full bg-yellow-500" > </div>
            < div className = "h-3 w-3 rounded-full bg-green-500" > </div>
              < /div>
              < CopyButton value = { "https://uicat.vercel.app/"} />
                </div>
                < pre className = "p-4 rounded-b-lg bg-muted border-x border-b overflow-x-auto font-mono" >
                  <code className="text-sm font-mono" >
                    { "https://uicat.vercel.app/"}
                    < /code>
                    < /pre>
                    < /div>
  );
};
