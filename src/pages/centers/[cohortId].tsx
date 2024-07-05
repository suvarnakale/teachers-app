import { Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import AddLeanerModal from '@/components/AddLeanerModal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import CohortLearnerList from '@/components/CohortLearnerList';
import { CustomField } from '@/utils/Interfaces';
import { GetStaticPaths } from 'next';
import Header from '@/components/Header';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { getCohortDetails } from '@/services/CohortServices';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const TeachingCenterDetails = () => {
  const [value, setValue] = React.useState(1);
  const router = useRouter();
  const { cohortId }: any = router.query;
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [cohortDetails, setCohortDetails] = React.useState<any>({});
  const [reloadState, setReloadState] = React.useState<boolean>(false);

  useEffect(() => {
    const getCohortData = async () => {
      const response = await getCohortDetails(cohortId);
      console.log(response);

      let cohortData = null;

      if (response?.cohortData?.length) {
        cohortData = response?.cohortData[0];

        if (cohortData?.customField?.length) {
          const district = cohortData.customField.find(
            (item: CustomField) => item.label === "District"
          );
          const state = cohortData.customField.find(
            (item: CustomField) => item.label === 'State'
          );

          cohortData.address = `${district?.value}, ${state?.value}` || '';
        }
        setCohortDetails(cohortData);
      }
    };
    getCohortData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleBackEvent = () => {
    window.history.back();
  };

  return (
    <>
      <Header />
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            // alignItems: 'center',
            color: '#4D4639',
            padding: '15px 17px 5px',
          }}
          width={'100%'}
          onClick={handleBackEvent}
        >
          <KeyboardBackspaceOutlinedIcon
            cursor={'pointer'}
            sx={{ color: theme.palette.warning['A200'], marginTop: '15px' }}
          />
          <Box m={'1rem 1rem 0.5rem'} display={'flex'} gap={'5px'}>
            <Typography textAlign={'left'} fontSize={'22px'}>
              {cohortDetails?.name}
            </Typography>
            {cohortDetails?.centerType && (
              <Typography textAlign={'left'} fontSize={'22px'}>
                (cohortDetails?.centerType)
              </Typography>
            )}
            <Box>
              <Typography textAlign={'left'} fontSize={'11px'} fontWeight={500}>
                {cohortDetails?.address}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit" // Use "inherit" to apply custom color
          aria-label="secondary tabs example"
          sx={{
            fontSize: '14px',
            borderBottom: '1px solid #EBE1D4',

            '& .MuiTab-root': {
              color: '#4D4639',
              padding: '0 20px',
            },
            '& .Mui-selected': {
              color: '#4D4639',
            },
            '& .MuiTabs-indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '100px',
              height: '3px',
            },
            '& .MuiTabs-scroller': {
              overflowX: 'unset !important',
            },
          }}
        >
          <Tab value={1} label={t('COMMON.LEARNER_LIST')} />
        </Tabs>
      </Box>
      <Box>
        {value === 1 && (
          <>
            <Box mt={3} px={'18px'}>
              <Button
                sx={{
                  border: '1px solid #1E1B16',
                  borderRadius: '100px',
                  height: '40px',
                  width: '126px',
                  color: theme.palette.error.contrastText,
                }}
                className="text-1E"
                endIcon={<AddIcon />}
              >
                {t('COMMON.ADD_NEW')}
              </Button>
            </Box>
            <Box
              px={'18px'}
              mt={2}
              sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}
            >
              <Box
                sx={{ color: theme.palette.secondary.main }}
                className="fs-14 fw-500"
                onClick={() => {
                  router.push('/attendance-overview');
                }}
              >
                {t('COMMON.REVIEW_ATTENDANCE')}
              </Box>
              <ArrowForwardIcon
                sx={{ fontSize: '18px', color: theme.palette.secondary.main }}
              />
            </Box>
            <Box>
              <CohortLearnerList
                cohortId={cohortId}
                reloadState={reloadState}
                setReloadState={setReloadState}
              />
            </Box>
          </>
        )}
        <AddLeanerModal
          learnersName={[
            'Aanya Gupta',
            'Aakash Sen',
            'Aisha Bhatt',
            'Ananya Umesh',
            'Bhavana Gill',
          ]}
        />
      </Box>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default TeachingCenterDetails;
