export default {
  control: {
    backgroundColor: '#fff',
    fontSize: '0.85rem',
    fontWeight: "bolder",
  },

  '&multiLine': {
    control: {
      fontFamily: 'monospace',
      // minHeight: 63,
    },
    highlighter: {
      // padding: 9,
      border: '1px solid transparent',
    },
    input: {
      padding: 9,
      border: '1px solid silver',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid red',
      padding: 10,
      zIndex: '10',
      fontSize: 14,
      overFlow: 'scroll'

    },
    item: {
      padding: '5px 15px',
      fontSize: 12,
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
}