import React, { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import styles from './copyButton.module.scss'

const CopyButton = ({ data = '' }) => {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setValue(data);
  }, [data]);

  if (typeof window === 'undefined') {
    return null;
  }

  const onCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = value;

    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
    setCopied(true);
  };

  if (copied) {
    return (
      <Button
        id="copy-button"
        className={styles.copy_button}
        content="copied"
        labelPosition="left"
        onClick={() => onCopy()}
      />
    );
  }
  return (
    <Button
      id="copy-button"
      className={styles.copy_button}
      content="copy code"
      labelPosition="left"
      onClick={() => onCopy()}
    />
  );
};

export default CopyButton;
