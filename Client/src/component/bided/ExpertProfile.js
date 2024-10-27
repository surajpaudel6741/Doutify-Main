import React from 'react';

const ExpertProfile = ({ expert = {} }) => {
  return (
    <div style={styles.profileContainer}>
      {/* Expert Details */}
      <div style={styles.header}>
        <img src={expert.picture} alt="Expert" style={styles.profilePicture} />
        <div style={styles.details}>
          <h2 style={styles.name}>{expert.name}</h2>
          <p style={styles.title}>{expert.title}</p>
          <p style={styles.description}>{expert.description}</p>
        </div>
      </div>

      {/* Links Row */}
      <div style={styles.links}>
        <h3 style={styles.sectionTitle}>Expert Links</h3>
        <div style={styles.linkRow}>
          {Array.isArray(expert.links) && expert.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>

      {/* Resume & Certifications in Improved Layout */}
      <div style={styles.documents}>
        <h3 style={styles.sectionTitle}>Documents</h3>
        <div style={styles.documentContainer}>
          <div style={styles.documentItem}>
            <img src={expert.resumeThumbnail} alt="Resume Thumbnail" style={styles.thumbnail} />
            <p>Resume</p>
          </div>
          {Array.isArray(expert.certificates) && expert.certificates.map((cert, index) => (
            <div key={index} style={styles.documentItem}>
              <img src={cert.thumbnail} alt={`Certificate ${index + 1}`} style={styles.thumbnail} />
              <p>{cert.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Doubts Solved & Feedback */}
      <div style={styles.feedback}>
        <h3 style={styles.sectionTitle}>Doubts Solved</h3>
        <div style={styles.grid}>
          {Array.isArray(expert.doubtsSolved) && expert.doubtsSolved.map((doubt, index) => (
            <div key={index} style={styles.doubtCard}>
              <h4 style={styles.doubtTitle}>{doubt.title}</h4>
              <p>Rating: {doubt.rating} ⭐</p>
              <p style={styles.feedbackText}>"{doubt.feedback}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// Updated inline styles for centered links
const styles = {
  profileContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    color: '#333',
    width: '90%',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  profilePicture: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginRight: '20px',
  },
  details: {
    color: '#333',
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
  },
  title: {
    fontSize: '18px',
    color: '#555',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginTop: '5px',
  },
  links: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#27a844', // Upwork green theme
    marginBottom: '10px',
  },
  linkRow: {
    display: 'flex',
    justifyContent: 'center', // Center-align links
    gap: '10px', // Space between links
    flexWrap: 'wrap', // Wrap links on smaller screens
  },
  link: {
    color: '#27a844',
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '5px 10px',
    borderRadius: '4px',
    backgroundColor: '#e8f5e9', // Light green background for links
    transition: 'background-color 0.3s',
  },
  linkHover: {
    backgroundColor: '#d0e6d1',
  },
  documents: {
    marginBottom: '20px',
  },
  documentContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    justifyContent: 'space-around',
  },
  documentItem: {
    textAlign: 'center',
    width: '110px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  },
  thumbnail: {
    width: '80px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
    marginBottom: '5px',
  },
  feedback: {
    marginTop: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  doubtCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  },
  doubtTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  feedbackText: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
  },
};

export default ExpertProfile;
