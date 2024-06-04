import ChannelMembers from "./members-list";

const RightMenuChannels = () => {
    return (
        <div className="flex-grow h-full space-y-1 border-4 border-blue-200 rounded-lg">
            <header className="flex items-center justify-between flex-grow w-full h-12 p-10 px-4 text-black border-b-2  bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
                <div className="ml-2 lg:text-4xl md:text-3xl sm:text-2xl font-bold">
                    Status
                </div>
            </header>

            <div className="flex flex-grow w-full h-full mt-2 rounded-md pb-32">
                <ChannelMembers></ChannelMembers>
            </div>
        </div>
    )
}

export default RightMenuChannels;