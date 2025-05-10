import { motion } from 'framer-motion';
import { Card, Text, Image } from '@mantine/core';
import PropTypes from 'prop-types';

const ImageCard = ({ example, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        shadow="sm"
        padding="sm"
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <Image
          src={`/src/assets/default_examples/${example.image}`}
          alt={example.image}
          height={100}
          width={150}
          fit="contain"
          style={{ maxWidth: '100%', maxHeight: '100px' }}
        />
        <Text size="sm" className="mt-2 truncate">{example.image}</Text>
      </Card>
    </motion.div>
  );
};

ImageCard.propTypes = {
  example: PropTypes.shape({
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ImageCard;
