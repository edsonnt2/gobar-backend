export default function removeAccents(string: string): string {
  const with_accents =
    'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ';

  const without_accents =
    'AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr';

  return string
    .split('')
    .map(char => {
      let newChar = char;
      with_accents.split('').forEach((letter, index) => {
        if (char === letter) {
          newChar = without_accents.split('')[index];
        }
      });

      return newChar;
    })
    .join('');
}
