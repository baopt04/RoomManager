import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const SidebarMenu = lazy(() => import('./components/Menu/SideBarMenu'));
const DashboardLayout = lazy(() => import('./layouts/Dashboard/DashBoardLayout'));
const GetAllHost = lazy(() => import('./components/Host/GetAllHost'));
const CreateHost = lazy(() => import('./components/Host/CreateHost'));
const GetAllHouseForRent = lazy(() => import('./components/HouseForRent/GetAllHouseForRent'));
const GetAllRoom = lazy(() => import('./components/Room/GetAllRoom'));
const CreateRoom = lazy(() => import('./components/Room/CreateRoom'));
const UpdateRoom = lazy(() => import('./components/Room/UpdateRoom'));
const GetAllWater = lazy(() => import('./components/water/GetAllWater'));
const GetAllElectricity = lazy(() => import('./components/Electricity/GetAllElectricity'));
const GetAllService = lazy(() => import('./components/service/GetAllService'));
const GetAllRoomServiceDetail = lazy(() => import('./components/RoomServiceDetail/GetAllRoomServiceDetail'));
const GetAllMain = lazy(() => import('./components/Maintencance/GetAllMain'));
const GetAllCustomer = lazy(() => import('./components/Customer/GetAllCustomer'));
const GetAllContract = lazy(() => import('./components/Contract/GetAllContract'));
const CreateContract = lazy(() => import('./components/Contract/CreateContract'));
const UpdateContract = lazy(() => import('./components/Contract/UpdateContract'));
const GetAllCar = lazy(() => import('./components/Car/GetAllCar'));
const CreateCar = lazy(() => import('./components/Car/CreateCar'));
const UpdateCar = lazy(() => import('./components/Car/UpdateCar'));
const SaleBill = lazy(() => import('./components/Bill/SaleBill'));
const GetAllBill = lazy(() => import('./components/Bill/GetAllBill'));
const DetailBill = lazy(() => import('./components/Bill/DetailBill'));
const UpdateBill = lazy(() => import('./components/Bill/UpdateBill'));
const DetailRoom = lazy(() => import('./components/Room/DetailRoom'));
const DetailContract = lazy(() => import('./components/Contract/DetailContract'));
const Statistical = lazy(() => import('./components/Statistical/statistical'));
const LoginRoom = lazy(() => import('./components/Login/LoginRoom'));
const PrivateRoute = lazy(() => import('./components/Router/PrivateRouter'));
const Register = lazy(() => import('./components/Login/Regesiter'));
const GetAllAdmin = lazy(() => import('./components/Admin/GetAllAdmin'));
const ClientLayout = lazy(() => import('./layouts/Client/ClientLayout'));
const HomePage = lazy(() => import('./components/Client/Home/HomePage'));
const RoomDetailClient = lazy(() => import('./components/Client/Room/RoomDetailClient'));
const GetAllRoomViewing = lazy(() => import('./components/Admin/RoomViewing/GetAllRoomViewing'));
const RoomsPage = lazy(() => import('./components/Client/Room/RoomsPage'));
const LocationsPage = lazy(() => import('./components/Client/Location/LocationsPage'));
const ExplorePage = lazy(() => import('./components/Client/Explore/ExplorePage'));
const AdminLogin = lazy(() => import('./components/Admin/Login/AdminLogin'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<ClientLayout><HomePage /></ClientLayout>} />
          <Route path="/rooms" element={<ClientLayout><RoomsPage /></ClientLayout>} />
          <Route path="/room/:slugAndId" element={<ClientLayout><RoomDetailClient /></ClientLayout>} />
          <Route path="/locations" element={<ClientLayout><LocationsPage /></ClientLayout>} />
          <Route path="/support" element={<ClientLayout><ExplorePage /></ClientLayout>} />

          {/* Auth Routes */}
          <Route path='/login' element={<LoginRoom />}></Route>
          <Route path='/admin/login' element={<AdminLogin />}></Route>
          <Route path='/register' element={<Register />}></Route>

          {/* Admin Routes */}
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
                    <Route path="/room-viewing-management" element={<GetAllRoomViewing />} />
                  </Routes>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
