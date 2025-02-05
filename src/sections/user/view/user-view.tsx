import type { SnackbarCloseReason } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { doc, query, where, getDocs, deleteDoc, updateDoc, collection } from 'firebase/firestore';

import { Edit, Delete, Visibility } from '@mui/icons-material';
import {
  Table,
  Paper,
  Modal,
  Button,
  TableRow,
  Snackbar,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  TableContainer,
} from '@mui/material';

import { db } from 'src/config/firebase';
import { Scrollbar } from 'src/components/scrollbar';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  address: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  fatherName: string;
  motherName: string;
  bloodGroup: string;
}
interface FormErrors {
  name?: string;
  class?: string;
  section?: string;
  rollNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  dob?: string;
  gender?: string;
  fatherName?: string;
  motherName?: string;
  bloodGroup?: string;
}

export function UserView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [generateUUID, setGenerateUUID] = useState(String(generateQuickGuid()));
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [login, setLogin] = useState(true);
  const [errMesg, setErrMesg] = useState('');

    const [errors, setErrors] = useState<FormErrors>({});
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: generateUUID,
    name: '',
    class: '',
    section: '',
    rollNumber: '',
    address: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    fatherName: '',
    motherName: '',
    bloodGroup: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, 'students'));
    // console.log(querySnapshot);
    // console.log(querySnapshot.docs);
    const studentsList = querySnapshot.docs.map(
      (docu) =>
        ({
          id: docu.id, // Add the document ID explicitly
          ...docu.data(),
        }) as Student
    );
    setStudents(studentsList);
  };
  function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15);
  }
  const validateFields = () => {
    const tempErrors: FormErrors = {};

    // Required fields validation
    if (!formData.name) tempErrors.name = 'Name is required.';
    if (!formData.class) tempErrors.class = 'Class is required.';
    if (!formData.rollNumber) tempErrors.rollNumber = 'Roll Number is required.';
    if (!formData.phone) tempErrors.phone = 'Phone number is required.';
    if (!formData.email) tempErrors.email = 'Email is required.';
    // if (!formData.dob) tempErrors.dob = 'Date of Birth is required.';
    if (!formData.address) tempErrors.address = 'Address is required.';
    // if (!formData.gender) tempErrors.dob = 'Gender is required.';
    if (!formData.fatherName) tempErrors.fatherName = 'Father Name is required.';
    if (!formData.motherName) tempErrors.motherName = 'Mother Name is required.';
    if (!formData.gender) tempErrors.gender = 'Gender is required.';
    if (!formData.bloodGroup) tempErrors.bloodGroup = 'BloodGroup is required.';
      if (!formData.section) tempErrors.section = 'Section is Required';

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address.';
    }

    // Phone number validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = 'Enter a valid 10-digit phone number.';
    }

    // Date Validation
    if (!formData.dob) {
      tempErrors.dob = 'Date of Birth is required.';
    } else if (Number.isNaN(new Date(formData.dob).getTime())) {
      tempErrors.dob = 'Enter a valid date.';
    } else {
      const today = new Date();
      const dob = new Date(formData.dob);
      const age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      const dayDifference = today.getDate() - dob.getDate();
      const adjustedAge =
        monthDifference < 0 || (monthDifference === 0 && dayDifference < 0) ? age - 1 : age;

      if (adjustedAge < 4) {
        tempErrors.dob = 'Date Of Birth should be before 4 years.';
      } else if (adjustedAge > 18) {
        tempErrors.dob = 'Date of Birth should not be after 18 years';
      }
    }
    // Gender Validation
    if (!formData.gender) {
      tempErrors.gender = 'Gender Field is Required';
    } else if (
      !(
        formData.gender === 'male' ||
        formData.gender === 'female' ||
        formData.gender === 'non binary'
      )
    ) {
      tempErrors.gender = 'Gender should be either male or female or non binary';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNavigation = async (id: any) => {
    navigate(`/students/${id}`);
  };
  const handlerEdit = async (id: any) => {
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('id', '==', id)); // Assuming 'id' is a field
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc1) => {
        console.log('Student Found:', doc1.data());
        const studentData = doc1.data() as Student;
        setFormData({ ...studentData }); // Here  i am overriding data id as it is not i meant to use document object Id
        setOpenModal(true);
      });
    } else {
      console.warn('No student found with this ID field.');
      setOpen(() => true);
      setErrMesg('Student not found with Paticular Id');
    }
  };
  async function handleUpdateStudent(id: String,e:any) {
    // const ref = await
    // console.log("ref "+ ref);
    // await setFormData((formd)=>({...formd,id:ref}))
    e.preventDefault();
    // console.log(formData);
    if (!validateFields()) {
      setOpen(() => true);
      setErrMesg(() => 'One of The Fields are Null or empty');
      return;
    }
    // console.log(formData);
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('id', '==', id)); // Assuming 'id' is a field
    const querySnapshot = await getDocs(q);
    // console.log(q);
    // console.log(await getDocs(q));
    // console.log(querySnapshot.docs.filter((docu)=>docu.id==id));
    if (querySnapshot.empty) {
      // console.log('No matching documents found.');
      return ;
    }

    querySnapshot.forEach(async (doc1) => {
      // console.log('Document ID:', doc1.id); // Firestore Document ID
      await updateDoc(doc(db, 'students', doc1.id), formData);
    });
    // await addDoc(collection(db, "students"), formData);

    setOpenModal(false);
    setFormData({
      id: '',
      name: '',
      class: '',
      section: '',
      rollNumber: '',
      address: '',
      phone: '',
      email: '',
      dob: '',
      gender: '',
      fatherName: '',
      motherName: '',
      bloodGroup: '',
    });
    fetchStudents();
    
  }
  const handleDeleteStudent = async (id: string) => {
    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('id', '==', id)); // Assuming 'id' is a field
    const querySnapshot = await getDocs(q);
    // console.log(q);
    // console.log(await getDocs(q));
    // console.log(querySnapshot.docs.filter((docu)=>docu.id==id));
    if (querySnapshot.empty) {
      // console.log('No matching documents found.');
      return null;
    }

    querySnapshot.forEach(async (doc1) => {
      // console.log('Document ID:', doc1.id); // Firestore Document ID
      await deleteDoc(doc(db, 'students', doc1.id));
    });

    fetchStudents();
    return 0;
  };
  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setErrMesg('');
  };
  return (
    <div style={{ padding: '20px' }}>
      <h1>Students List</h1>
      <Button variant="contained" onClick={() => navigate('/students/add')}>
        Add Student
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      handleNavigation(student.id);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handlerEdit(student.id);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteStudent(student.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Scrollbar >
        <Modal open={openModal} style={{ height: '100vh' }} onClose={() => setOpenModal(false)}>
          <div
          style={{
            padding: '20px',
            backgroundColor: 'white',
            margin: 'auto',
            marginTop: '3%',
            width: '50%',
            maxHeight: '90vh',  // Limit the height to 90% of the viewport
            overflowY: 'auto',  // Allow vertical scrolling if content overflows
          }}>
            <h2>Edit Student</h2>
            <form>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.class}
                helperText={errors.class}
              />
              <TextField
                label="Section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.section}
                helperText={errors.section}
              />
              <TextField
                label="Roll Number"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.rollNumber}
                helperText={errors.rollNumber}
              />
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.address}
                helperText={errors.address}
              />
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <TextField
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                // fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.dob}
                helperText={errors.dob}
              />
              <TextField
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value.toLowerCase() })}
                fullWidth
                margin="normal"
                error={!!errors.gender}
                helperText={errors.gender}
              />
              <TextField
                label="Father's Name"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.fatherName}
                helperText={errors.fatherName}
              />
              <TextField
                label="Mother's Name"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.motherName}
                helperText={errors.motherName}
              />
              <TextField
                label="Blood Group"
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value.toUpperCase() })
                }
                fullWidth
                margin="normal"
                error={!!errors.bloodGroup}
                helperText={errors.bloodGroup}
              />
              <Button variant="contained" onClick={(e) => handleUpdateStudent(formData.id, e)}>
                Submit
              </Button>
            </form>
          </div>
        </Modal>
      </Scrollbar>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={errMesg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
}

// export default UserView;
