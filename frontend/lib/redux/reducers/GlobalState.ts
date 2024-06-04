import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitGlobalState = {
    createState: boolean,
    settingState: boolean,
    ModalVisibility: boolean,
    type: string,
    MessagesState: boolean,
    ChannelsState: boolean,
    RightMenuState: boolean,
    LeftMenuState: boolean,
    Interface: string,
    AllChannels: any[],
    Channel: {
        id: string,
        createdAt: string,
        updatedAt: string,
        name: string,
        avatar: string,
        type: string,
        password: string,
        subject: string,
        members: any,
        messages: any,
    }
    RouteInfo: any,
    inChange: boolean,
}

const initialState = {
    createState: false,
    settingState: false,
    ModalVisibility: false,
    type: '',
    MessagesState: false,
    ChannelsState: true,
    RightMenuState: false,
    LeftMenuState: false,
    Interface: "Initial",
     AllChannels: [],
    Channel: {
        id: "",
        createdAt: "",
        updatedAt: "",
        name: "",
        avatar: "",
        type: "",
        password: "",
        subject: "",
        members: null,
        messages: null,
    },
    RouteInfo: null,
    inChange: false,

} as InitGlobalState

export const GlobalStateSlice = createSlice ({
    name: 'globalState',
    initialState,
    reducers: {
        setModalVisibility: (state, action: PayloadAction<boolean>) => {
            state.ModalVisibility  = action.payload;
        },
        setType: (state, action: PayloadAction<string>) => {
            state.type = action.payload;
        },
        setMessagesState: (state, action: PayloadAction<boolean>) => {
            state.MessagesState = action.payload;
        },
        setChannelsState: (state, action: PayloadAction<boolean>) => {
            state.ChannelsState = action.payload;
        },
        setRightMenuState: (state, action: PayloadAction<boolean>) => {
            state.RightMenuState = action.payload;
        },
        setLeftMenuState: (state, action: PayloadAction<boolean>) => {
            state.LeftMenuState = action.payload;
        },
        setInterface: (state, action: PayloadAction<string>) => {
            state.Interface = action.payload;
        },
        setAllChannels: (state, action: PayloadAction<any>) => {
            state.AllChannels = action.payload;
        },
        setChannel: (state, action: PayloadAction<any>) => {
            state.Channel = action.payload;
        },
        setRouteInfo: (state, action: PayloadAction<any>) => {
            state.RouteInfo = action.payload;
        }, 
        setInChange: (state, action: PayloadAction<boolean>) => {
            state.inChange = action.payload;
        },
        setCreateState: (state, action: PayloadAction<boolean>) => { 
            state.createState = action.payload;
        },
        setSettingState: (state, action: PayloadAction<boolean>) => { 
            state.settingState = action.payload;
        }

    }
})

export const { setModalVisibility, setType, setMessagesState, setChannelsState, setRightMenuState, setLeftMenuState, setInterface, setAllChannels, setChannel, setRouteInfo, setInChange, setCreateState, setSettingState } = GlobalStateSlice.actions
export default GlobalStateSlice.reducer