import { useParams } from 'react-router-dom';
import Notebook from '../../components/Notebook';

export default function NotebookPage() {
  const { id } = useParams();

  return <Notebook key={id} />;
}
