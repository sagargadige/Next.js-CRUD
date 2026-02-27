"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataTable = dynamic(() => import('react-data-table-component'), {
  ssr: false,
});

const initialUser = {
  name: '',
  email: '',
  password: '',
  phone: '',
};

const STORAGE_KEY = 'users_data';

const generateId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const getUsersFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Ensure every row has a stable key for DataTable rendering.
    return parsed.map(item => ({
      ...item,
      _id: item?._id || generateId(),
    }));
  } catch {
    return [];
  }
};

const saveUsersToStorage = users => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const Page = () => {
  const [user, setUser] = useState(initialUser);
  const [list, setList] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [editingId, setEditingId] = useState(null);

  const columns = [
    {
      name: 'Sr. No',
      cell: (_, index) => index + 1,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
    },
    {
      name: 'Password',
      selector: row => row.password,
    },
    {
      name: 'Phone',
      selector: row => row.phone,
    },
    {
      name: 'Action',
      width: '200px',
      minWidth: '200px',
      maxWidth: '200px',
      allowOverflow: true,
      button: true,
      cell: row => (
        <div className='app-action-group'>
          <button type='button' className='btn btn-sm app-action-btn app-btn-danger' onClick={() => handleDelete(row._id)}>Delete</button>
          <button type='button' className='btn btn-sm app-action-btn app-btn-edit' onClick={() => handleEdit(row._id)}>Edit</button>
        </div>
      ),
    },
  ];

  const tableStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        color: '#0b2239',
        fontSize: '0.9rem',
        fontWeight: '700',
      },
    },
    rows: {
      style: {
        minHeight: '58px',
        color: '#334155',
      },
      highlightOnHoverStyle: {
        backgroundColor: '#f0f7ff',
        borderBottomColor: '#dbeafe',
        outline: '1px solid #dbeafe',
      },
    },
    pagination: {
      style: {
        borderTop: '1px solid #e6edf5',
        color: '#475569',
        backgroundColor: '#ffffff',
      },
    },
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const resetForm = () => {
    setUser(initialUser);
    setEditingId(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedList = list.map(item => (
          item._id === editingId ? { ...item, ...user } : item
        ));
        saveUsersToStorage(updatedList);
        setList(updatedList);
        toast.success(`${user.name} Updated.`);
      } else {
        const newUser = { ...user, _id: generateId() };
        const updatedList = [...list, newUser];
        saveUsersToStorage(updatedList);
        setList(updatedList);
        toast.success('User Created.');
      }

      resetForm();
    } catch (error) {
      console.log(error.message);
      toast.error('Operation failed.');
    }
  };

  useEffect(() => {
    setList(getUsersFromStorage());
  }, []);

  useEffect(() => {
    if (!searchValue) {
      setSearchData([]);
      return;
    }
    const filtered = list.filter(item => (item.name || '').toLowerCase().includes(searchValue.toLowerCase()));
    setSearchData(filtered);
  }, [list, searchValue]);

  const handleDelete = id => {
    try {
      const deletedUser = list.find(item => item._id === id);
      const updatedList = list.filter(item => item._id !== id);
      saveUsersToStorage(updatedList);
      setList(updatedList);
      toast.success(`${deletedUser?.name || 'User'} Deleted.`);
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Delete failed.');
    }
  };

  const handleEdit = id => {
    try {
      const selectedUser = list.find(item => item._id === id);
      if (!selectedUser) {
        toast.error('Unable to load user for edit.');
        return;
      }
      setUser({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        password: selectedUser.password || '',
        phone: selectedUser.phone?.toString() || '',
      });
      setEditingId(id);
      toast.info('Edit mode enabled.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.log(error.message);
      toast.error('Unable to load user for edit.');
    }
  };

  const handleSearch = e => {
    const { value } = e.target;
    setSearchValue(value);
    const newData = list.filter(item => (item.name || '').toLowerCase().includes(value.toLowerCase()));
    setSearchData(newData);
  };

  return (
    <>
      <div className='container-fluid app-shell'>
        <div className='app-center-wrap'>
          <div className='app-form-wrap'>
            <form method='post' onSubmit={handleSubmit} className='app-surface app-form-card p-4 p-md-5'>
              <h2 className='app-title text-center'>{editingId ? 'Edit User Data' : 'Add User Data'}</h2>

              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>Name</label>
                <input type='text' className='form-control app-input' onChange={handleChange} value={user.name} name='name' id='name' />
              </div>
              <div className='mb-3'>
                <label htmlFor='email' className='form-label text-capitalize'>email</label>
                <input type='text' className='form-control app-input' onChange={handleChange} value={user.email} name='email' id='email' />
              </div>
              <div className='mb-3'>
                <label htmlFor='password' className='form-label text-capitalize'>password</label>
                <input type='password' className='form-control app-input' onChange={handleChange} value={user.password} name='password' id='password' />
              </div>
              <div className='mb-3'>
                <label htmlFor='phone' className='form-label text-capitalize'>phone</label>
                <input type='number' className='form-control app-input' onChange={handleChange} value={user.phone} name='phone' id='phone' />
              </div>
              <div className='d-flex gap-2 justify-content-center'>
                <button type='submit' className='btn app-submit-btn'>{editingId ? 'Update' : 'Submit'}</button>
                {editingId && (
                  <button type='button' className='btn app-cancel-btn' onClick={resetForm}>Cancel</button>
                )}
              </div>
            </form>
          </div>
          <div className='app-table-wrap mt-4 mt-md-5'>
            <form method='post'>
              <input type='search' onChange={handleSearch} className='form-control app-input app-search mb-3 mx-auto' placeholder='Search by user name.' />
            </form>
            <div className='table-responsive app-surface app-table-card p-2 p-md-3'>
              <DataTable
                data={searchData.length > 0 || searchValue.length != 0 ? searchData : list}
                keyField='_id'
                columns={columns}
                pagination
                title='User List'
                customStyles={tableStyles}
              />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </>
  );
};

export default Page
