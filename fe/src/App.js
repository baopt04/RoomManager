import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';

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
      <SpeedInsights />
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
                    <Route path="/admin/sidebar" element={<SidebarMenu />} />
                    <Route path="/admin/dashboard" element={<DashboardLayout />} />

                    {/* Hosts */}
                    <Route path="/admin/hosts" element={<GetAllHost />} />
                    <Route path="/admin/hosts/create" element={<CreateHost />} />

                    {/* Houses for rent */}
                    <Route path="/admin/houses-for-rent" element={<GetAllHouseForRent />} />

                    {/* Rooms */}
                    <Route path="/admin/rooms" element={<GetAllRoom />} />
                    <Route path="/admin/rooms/create" element={<CreateRoom />} />
                    <Route path="/admin/rooms/:roomId" element={<DetailRoom />} />
                    <Route path="/admin/rooms/:roomId/edit" element={<UpdateRoom />} />

                    {/* Utilities & services */}
                    <Route path="/admin/waters" element={<GetAllWater />} />
                    <Route path="/admin/electricities" element={<GetAllElectricity />} />
                    <Route path="/admin/services" element={<GetAllService />} />
                    <Route path="/admin/room-services" element={<GetAllRoomServiceDetail />} />
                    <Route path="/admin/maintenances" element={<GetAllMain />} />

                    {/* Customers */}
                    <Route path="/admin/customers" element={<GetAllCustomer />} />

                    {/* Contracts */}
                    <Route path="/admin/contracts" element={<GetAllContract />} />
                    <Route path="/admin/contracts/create" element={<CreateContract />} />
                    <Route path="/admin/contracts/:contractId" element={<DetailContract />} />
                    <Route path="/admin/contracts/:contractId/edit" element={<UpdateContract />} />

                    {/* Cars */}
                    <Route path="/admin/cars" element={<GetAllCar />} />
                    <Route path="/admin/cars/create" element={<CreateCar />} />
                    <Route path="/admin/cars/:carId/edit" element={<UpdateCar />} />

                    {/* Bills */}
                    <Route path="/admin/bills" element={<GetAllBill />} />
                    <Route path="/admin/bills/create" element={<SaleBill />} />
                    <Route path="/admin/bills/:billId" element={<DetailBill />} />
                    <Route path="/admin/bills/:billId/edit" element={<UpdateBill />} />

                    {/* Statistics */}
                    <Route path="/admin/statistics" element={<Statistical />} />

                    {/* System */}
                    <Route path="/admin/admins" element={<GetAllAdmin />} />
                    <Route path="/admin/room-viewings" element={<GetAllRoomViewing />} />
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
