import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import đúng từ react-router-dom
import SidebarMenu from './components/Menu/SideBarMenu'; // Import SidebarMenu
import DashboardLayout from './layouts/Dashboard/DashBoardLayout';
import GetAllHost from './components/Host/GetAllHost';
import CreateHost from './components/Host/CreateHost';
import GetAllHouseForRent from './components/HouseForRent/GetAllHouseForRent';
import GetAllRoom from './components/Room/GetAllRoom';
import CreateRoom from './components/Room/CreateRoom';
import UpdateRoom from './components/Room/UpdateRoom';
import GetAllWater from './components/water/GetAllWater';
import GetAllElectricity from './components/Electricity/GetAllElectricity';
import GetAllService from './components/service/GetAllService';
import GetAllRoomServiceDetail from './components/RoomServiceDetail/GetAllRoomServiceDetail';
import GetAllMain from './components/Maintencance/GetAllMain';
import GetAllCustomer from './components/Customer/GetAllCustomer';
import GetAllContract from './components/Contract/GetAllContract';
import CreateContract from './components/Contract/CreateContract';
import UpdateContract from './components/Contract/UpdateContract';
import GetAllCar from './components/Car/GetAllCar';
import CreateCar from './components/Car/CreateCar';
import UpdateCar from './components/Car/UpdateCar';
import SaleBill from './components/Bill/SaleBill';
import GetAllBill from './components/Bill/GetAllBill';
import DetailBill from './components/Bill/DetailBill';
import UpdateBill from './components/Bill/UpdateBill';
import DetailRoom from './components/Room/DetailRoom';
import DetailContract from './components/Contract/DetailContract';
import Statistical from './components/Statistical/statistical';
import LoginRoom from './components/Login/LoginRoom';
import PrivateRoute from './components/Router/PrivateRouter';
import Register from './components/Login/Regesiter';
import GetAllAdmin from './components/Admin/GetAllAdmin';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginRoom />}></Route>
        <Route path='/register' element={<Register />}></Route>

        <Route
          path="/*"
          element={
            <PrivateRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/sidebar" element={<SidebarMenu />} />
                <Route path="/dashboard" element={<DashboardLayout />} />
                <Route path="/host-management" element={<GetAllHost />} />
                <Route path="/houseForRent-management" element={<GetAllHouseForRent />} />
                <Route path="/createHost" element={<CreateHost />} />
                <Route path="/room-management" element={<GetAllRoom />} />
                <Route path="/room-management/createRoom" element={<CreateRoom />} />
                <Route path="/room-management/updateRoom/:roomId" element={<UpdateRoom />} />
                <Route path="/room-management/detailRoom/:roomId" element={<DetailRoom />} />
                <Route path="/water-management" element={<GetAllWater />} />
                <Route path="/electricity-management" element={<GetAllElectricity />} />
                <Route path="/service-management" element={<GetAllService />} />
                <Route path="/roomSerivce-management" element={<GetAllRoomServiceDetail />} />
                <Route path="/maintenance-management" element={<GetAllMain />} />
                <Route path="/customer-management" element={<GetAllCustomer />} />
                <Route path="/contract-management" element={<GetAllContract />} />
                <Route path="/contract-management/createContract" element={<CreateContract />} />
                <Route path="/contract-management/updateContract/:contractId" element={<UpdateContract />} />
                <Route path="/contract-management/detailContract/:contractId" element={<DetailContract />} />
                <Route path="/car-management" element={<GetAllCar />} />
                <Route path="/car-management/createCar" element={<CreateCar />} />
                <Route path="/car-management/updateCar/:carId" element={<UpdateCar />} />
                <Route path="/sale-counter" element={<SaleBill />} />
                <Route path="/bill-management" element={<GetAllBill />} />
                <Route path="/bill-management/detail/:billId" element={<DetailBill />} />
                <Route path="/bill-management/update/:billId" element={<UpdateBill />} />
                <Route path="/statistical" element={<Statistical />} />
                <Route path="/admin-management" element={<GetAllAdmin />} />
              </Routes>
            </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
