import { FC, ReactElement, useState } from 'react';
import { Accordion, Dropdown, DropdownItemProps, Icon } from 'semantic-ui-react';
import { Sort as MessageSort } from 'src/interfaces';

type Props = {
  sort: MessageSort;
  setSearchParam: (name: string, value?: string | string[]) => void;
};

export const Sort: FC<Props> = (props: Props): ReactElement => {
  const [active, setActive] = useState(true);

  const options: DropdownItemProps[] = Object.values(MessageSort).map(option => ({
    text: option, value: option,
  }));
  const value = options.find(option => props.sort === option.value)?.value || MessageSort.MostRecent;

  return (
    <>
      <Accordion.Title active={active} onClick={() => setActive(!active)}>
        <Icon name="sort" />
        Sort
      </Accordion.Title>

      <Accordion.Content active={active}>
        <Dropdown fluid selection value={value} options={options} onChange={(_, data) => props.setSearchParam('sort', data.value === MessageSort.MostRecent ? undefined : data.value as string)} />
      </Accordion.Content>
    </>
  );
}
