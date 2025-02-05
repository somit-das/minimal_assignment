import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Group as GroupIcon,
  Bloodtype as BloodtypeIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

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

const UserIndividual: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!id) {
          setError('Invalid student ID');
          return;
        }

        // const docRef = await doc(db, 'students', id);
        // const docSnap = await getDoc(docRef);
        // const bool = await docSnap.exists();
        // console.log(bool, docSnap)
        // if (docSnap.exists()) {
        //   setStudent({ id: docSnap.id, ...docSnap.data() } as Student);
        // } else {
        //   setError('Student not found');
        // }
        // console.log('Querying for student with field ID:', id);

        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('id', '==', id)); // Assuming 'id' is a field
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc1) => {
            // console.log('Student Found:', doc1.data());
             const studentData = doc1.data() as Student;
            setStudent({ ...studentData });
          });
        } else {
          console.warn('No student found with this ID field.');
          setError('Student not found');
        }
        //   } catch (error) {
        //     console.error('Firestore query error:', error);
        //     setError('Failed to fetch student data');
        //   } finally {
        //     setLoading(false);
      } catch (err) {
        setError('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Back to Students List
        </Button>
      </Container>
    );
  }

  if (!student) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Back to List
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/students/edit/${student.id}`)}
          >
            Edit
          </Button>
        </Box>

        {/* Student Profile Section */}
        <Grid container spacing={3}>
          {/* Avatar Section */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 150,
                height: 150,
                fontSize: 48,
                bgcolor: 'primary.main',
                margin: '0 auto 16px',
              }}
            >
              {student.name.charAt(0)}
            </Avatar>
            <Typography variant="h4" gutterBottom>
              {student.name}
            </Typography>
            <Chip
              label={student.gender}
              icon={student.gender === 'Male' ? <MaleIcon /> : <FemaleIcon />}
              color="primary"
              variant="outlined"
            />
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={8}>
            {/* Academic Info */}
            <SectionHeader icon={<SchoolIcon />} title="Academic Information" />
            <DetailItem label="Class" value={student.class} />
            <DetailItem label="Section" value={student.section} />
            <DetailItem label="Roll Number" value={student.rollNumber} />

            <Divider sx={{ my: 2 }} />

            {/* Personal Info */}
            <SectionHeader icon={<PersonIcon />} title="Personal Information" />
            <DetailItem label="Date of Birth" value={new Date(student.dob).toLocaleDateString()} />
            <DetailItem label="Blood Group" value={student.bloodGroup} icon={<BloodtypeIcon />} />

            <Divider sx={{ my: 2 }} />

            {/* Contact Info */}
            <SectionHeader icon={<HomeIcon />} title="Contact Information" />
            <DetailItem label="Address" value={student.address} />
            <DetailItem label="Phone" value={student.phone} icon={<PhoneIcon />} />
            <DetailItem label="Email" value={student.email} icon={<EmailIcon />} />

            <Divider sx={{ my: 2 }} />

            {/* Parent Info */}
            <SectionHeader icon={<GroupIcon />} title="Parent Information" />
            <DetailItem label="Father's Name" value={student.fatherName} />
            <DetailItem label="Mother's Name" value={student.motherName} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

// Reusable Section Header Component
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
    {React.cloneElement(icon as React.ReactElement, { color: 'primary' })}
    <Typography variant="h6" sx={{ ml: 1 }}>
      {title}
    </Typography>
  </Box>
);

// Reusable Detail Item Component
const DetailItem: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <Grid container spacing={2} sx={{ mb: 1 }}>
    <Grid item xs={4}>
      <Typography variant="body2" color="textSecondary">
        {label}:
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && React.cloneElement(icon as React.ReactElement, { sx: { mr: 1 } })}
        <Typography variant="body1">{value}</Typography>
      </Box>
    </Grid>
  </Grid>
);

export default UserIndividual;
